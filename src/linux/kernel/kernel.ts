// The kernel: process table, cooperative scheduler, signals, exit/wait,
// vfork and exec. All processes run on one thread; a process gives up the
// thread when it blocks (Asyncify unwind), exits, or uses up its time slice
// at a yield point (bbw.yield, fd_write, poll).
import { E, S, SIG, SIGNAL_NAMES } from "./constants.ts";
import { OpenFile, openInode } from "./files.ts";
import { ExecSignal, ExitSignal, Image, VforkDone, utf8ToBin } from "./image.ts";
import {
  CONTINUED_STATUS,
  DISP,
  Process,
  exitedStatus,
  sigbit,
  signaledStatus,
  stoppedStatus,
  type Wait,
} from "./process.ts";
import { makeImports } from "./syscalls.ts";
import { BLOCK, Tty } from "./tty.ts";
import { Inode, KError, Vfs } from "./vfs.ts";

export const MAX_PROCS = 64;
/** Nested vforks per image (a vfork child that vforks, e.g. to daemonize). */
const MAX_VFORK_DEPTH = 4;
const SLICE_MS = 10;
const TICK_MS = 12;
const KILLABLE = ~(sigbit(SIG.KILL) | sigbit(SIG.STOP)) & 0xffffffffffffffffn;

/** Thrown through wasm to end a process killed by a signal. */
export class Terminated {
  sig: number;
  constructor(sig: number) {
    this.sig = sig;
  }
}

export interface KernelHost {
  output(bytes: Uint8Array): void;
  outputReady(): boolean;
}

export interface KernelOptions {
  env?: string[];
  /** Called with each login shell's exit status. Return false to not respawn. */
  onLogout?: (status: number) => boolean | void;
}

export class Kernel {
  readonly vfs: Vfs;
  readonly tty: Tty;
  readonly module: WebAssembly.Module;
  readonly host: KernelHost;
  readonly procs = new Map<number, Process>();
  readonly bootTime = Date.now();
  hostname = "linuxfest";
  env: string[];
  private opts: KernelOptions;
  private nextPid = 2;
  private runQueue: Process[] = [];
  private queued = new Set<Process>();
  /** The process whose image is executing right now. */
  running?: Process;
  private sliceStart = 0;
  private scheduled = false;
  private timer?: ReturnType<typeof setTimeout>;
  private timerAt = 0;
  private channel = new MessageChannel();
  init: Process;
  loginPid = 0;
  /** Recent CPU use for loadavg (exponentially decayed busy fraction). */
  load = [0, 0, 0];
  private loadAt = performance.now();
  private busyMs = 0;
  /** Imports must match what busybox.wasm asks for; checked on first use. */
  private importsChecked = false;

  constructor(module: WebAssembly.Module, vfs: Vfs, host: KernelHost, opts: KernelOptions = {}) {
    this.module = module;
    this.vfs = vfs;
    this.host = host;
    this.opts = opts;
    this.env = (opts.env ?? []).map(utf8ToBin);
    this.tty = new Tty({
      signalGroup: (pgid, sig) => this.killGroup(pgid, sig),
      output: (b) => host.output(b),
      outputReady: () => host.outputReady(),
      wake: () => this.wake(),
    });
    this.channel.port1.onmessage = () => this.tick();
    this.init = new Process(1, 0, vfs.root);
    this.init.comm = "init";
    this.init.argv = ["init"];
    this.init.state = "blocked";
    this.procs.set(1, this.init);
  }

  /** Starts the login shell. */
  boot() {
    this.spawnLogin();
  }

  /** Stops all timers so a test process can exit. */
  shutdown() {
    clearTimeout(this.timer);
    this.channel.port1.close();
    this.channel.port2.close();
    for (const p of this.procs.values()) if (p.pid !== 1) this.exitProcess(p, signaledStatus(SIG.KILL), false);
  }

  private spawnLogin() {
    const p = new Process(this.nextPid++, 1, this.vfs.resolve(this.vfs.root, "/root").inode);
    this.procs.set(p.pid, p);
    const dev = this.vfs.resolve(this.vfs.root, "/dev/tty1").inode;
    const f = openInode(this.vfs, dev, 2, () => this.tty);
    p.fds = [
      { file: f, cloexec: false },
      { file: f, cloexec: false },
      { file: f, cloexec: false },
    ];
    f.refs = 3;
    this.tty.sid = p.sid;
    this.tty.fgPgrp = p.pgid;
    this.loginPid = p.pid;
    p.env = [...this.env];
    // "sh -l", not argv[0] "-sh": hush re-execs itself with its argv[0] for
    // subshells, which would make every subshell a login shell.
    const r = this.loadProgram(p, "/bin/sh", ["sh", "-l"]);
    if (typeof r === "number") throw new Error("cannot start /bin/sh: errno " + r);
    this.commitExec(p, r);
    this.enqueue(p);
  }

  // ---- scheduler ----

  wake() {
    if (this.scheduled) return;
    this.scheduled = true;
    this.channel.port2.postMessage(0);
  }

  private enqueue(p: Process) {
    if (this.queued.has(p)) return;
    this.queued.add(p);
    this.runQueue.push(p);
    this.wake();
  }

  private tick() {
    this.scheduled = false;
    const start = performance.now();
    for (;;) {
      this.pollBlocked();
      const p = this.runQueue.shift();
      if (!p) break;
      this.queued.delete(p);
      if (p.state !== "runnable") continue;
      this.run(p);
      if (performance.now() - start > TICK_MS) break;
    }
    this.busyMs += performance.now() - start;
    this.updateLoad();
    if (this.runQueue.length) this.wake();
    else this.armTimer();
  }

  /** Signals, readiness and deadlines of processes that are not running. */
  private pollBlocked() {
    const now = Date.now();
    for (const p of this.procs.values()) {
      if (p.alarmAt && now >= p.alarmAt) {
        p.alarmAt = 0;
        this.post(p, SIG.ALRM);
      }
      if (p.pending) this.applySignals(p);
      if (p.state !== "blocked" || !p.wait || p.pid === 1) continue;
      const r = p.wait.check();
      if (r !== BLOCK) this.resume(p, r, false);
    }
  }

  private resume(p: Process, r: number, interrupted: boolean) {
    p.wait = undefined;
    p.state = "runnable";
    p.interrupted = interrupted;
    p.image!.rewindValue = r;
    this.enqueue(p);
  }

  private armTimer() {
    let next = Infinity;
    for (const p of this.procs.values()) {
      if (p.alarmAt) next = Math.min(next, p.alarmAt);
      const d = p.state === "blocked" ? p.wait?.deadline?.() : undefined;
      if (d !== undefined) next = Math.min(next, d);
    }
    if (next === Infinity) {
      clearTimeout(this.timer);
      this.timerAt = 0;
      return;
    }
    if (this.timerAt === next) return;
    clearTimeout(this.timer);
    this.timerAt = next;
    this.timer = setTimeout(() => {
      this.timerAt = 0;
      this.wake();
    }, Math.max(0, next - Date.now()));
  }

  private updateLoad() {
    const now = performance.now();
    const dt = now - this.loadAt;
    if (dt < 1000) return;
    const busy = Math.min(1, this.busyMs / dt) + (this.runQueue.length ? 1 : 0) * 0;
    [60, 300, 900].forEach((period, i) => {
      const k = Math.exp(-dt / 1000 / period);
      this.load[i] = this.load[i] * k + busy * (1 - k);
    });
    this.loadAt = now;
    this.busyMs = 0;
  }

  private run(p: Process) {
    const img = p.image!;
    this.running = p;
    const t0 = (this.sliceStart = performance.now());
    let result;
    try {
      result = img.step();
    } catch (e) {
      result = { kind: "exit" as const, status: this.faultStatus(p, e) };
    } finally {
      this.running = undefined;
      p.cpuMs += performance.now() - t0;
    }
    if (result.kind === "exit") {
      if (result.returned) {
        p.exiting = true;
        this.running = p;
        try {
          img.flushOnExit();
        } catch (e) {
          if (!(e instanceof Terminated)) console.error(e);
        } finally {
          this.running = undefined;
        }
      }
      this.exitProcess(p, result.status);
    } else if (result.kind === "exec") {
      this.commitExec(p, result.image);
      this.enqueue(p);
    }
  }

  private faultStatus(p: Process, e: unknown): number {
    if (e instanceof Terminated) return signaledStatus(e.sig);
    if (e instanceof ExitSignal) return e.status;
    // A wasm trap (unreachable, out of bounds) or a kernel bug: SIGSEGV.
    console.error(`[linux] pid ${p.pid} (${p.comm}) crashed:`, e);
    return signaledStatus(SIG.SEGV);
  }

  /** True if the current import may unwind (block, stop or be preempted). */
  canSuspend(img: Image) {
    return !img.inVforkChild && !img.current.exiting && img.current.inHandler === 0;
  }

  sliceUsed() {
    return performance.now() - this.sliceStart > SLICE_MS;
  }

  /**
   * Runs a blocking operation for an import. `op` returns the import's result
   * or BLOCK. On BLOCK the process suspends; the scheduler re-runs `op` until
   * it is ready, or wakes the process with `intr` when a signal arrives.
   */
  blocking(img: Image, op: () => number, w: { intr: () => number; restart?: boolean; deadline?: () => number | undefined; nonblock?: () => number }): number {
    const p = img.current;
    if (img.rewinding) {
      const r = img.finishRewind() as number;
      if (!p.interrupted) return this.finish(img, r, true);
      p.interrupted = false;
      const restart = this.deliver(img, false);
      if (!w.restart || !restart) return this.finish(img, w.intr(), true);
      // every handler had SA_RESTART: try again
    }
    const r = op();
    if (r !== BLOCK) return this.finish(img, r, true);
    if (!this.canSuspend(img)) return this.finish(img, w.nonblock ? w.nonblock() : -E.EAGAIN, false);
    p.wait = { check: op, intr: w.intr, deadline: w.deadline };
    p.state = "blocked";
    img.unwind();
    return 0;
  }

  /** End of an import: delivers signals, may stop or preempt (async imports). */
  finish<T extends number | bigint>(img: Image, r: T, async: boolean): T {
    const p = img.current;
    if (!this.canSuspend(img)) {
      if (!img.inVforkChild && !p.exiting) this.deliver(img, false);
      return r;
    }
    if (img.rewinding) return r;
    const stop = this.deliver(img, async);
    if (stop === "stop") {
      p.wait = { check: () => r as number, intr: () => r as number, stopped: true };
      p.state = "stopped";
      p.resumeState = "blocked";
      img.unwind();
      return r;
    }
    if (async && this.sliceUsed()) {
      // Preempted: requeue; the import returns r when rewound.
      p.state = "runnable";
      img.rewindValue = r as number;
      this.enqueue(p);
      img.unwind();
    }
    return r;
  }

  /**
   * Delivers pending signals to the running process. Returns "stop" when the
   * process must stop (only if canStop), otherwise true if no handler that
   * ran lacked SA_RESTART.
   */
  private deliver(img: Image, canStop: boolean): "stop" | boolean {
    const p = img.current;
    let restart = true;
    for (;;) {
      const sig = p.nextSignal();
      if (!sig) return restart;
      const bit = sigbit(sig);
      if (sig === SIG.KILL) throw new Terminated(sig);
      const disp = p.disp[sig];
      if (disp === DISP.IGNORE) {
        p.pending &= ~bit;
        continue;
      }
      if (disp === DISP.DEFAULT) {
        const act = Process.defaultAction(sig);
        if (act === "term") throw new Terminated(sig);
        if (act === "stop") {
          if (!canStop) return restart;
          p.pending &= ~bit;
          this.stopped(p, sig);
          return "stop";
        }
        p.pending &= ~bit;
        continue;
      }
      p.pending &= ~bit;
      if (disp !== DISP.HANDLER_RESTART) restart = false;
      p.inHandler++;
      try {
        img.exports.bbw_deliver(sig);
      } finally {
        p.inHandler--;
      }
    }
  }

  /** Default actions for a process that is not running. */
  private applySignals(p: Process) {
    if (p.state === "zombie" || p === this.running || p.pid === 1) return;
    for (;;) {
      const sig = p.nextSignal();
      if (!sig) return;
      const bit = sigbit(sig);
      if (sig === SIG.KILL) {
        this.exitProcess(p, signaledStatus(sig));
        return;
      }
      const disp = p.disp[sig];
      if (disp === DISP.IGNORE) {
        p.pending &= ~bit;
        continue;
      }
      if (disp === DISP.DEFAULT) {
        const act = Process.defaultAction(sig);
        if (act === "term") {
          this.exitProcess(p, signaledStatus(sig));
          return;
        }
        p.pending &= ~bit;
        if (act === "stop" && p.state !== "stopped") {
          p.resumeState = p.state;
          p.state = "stopped";
          this.stopped(p, sig);
        }
        continue;
      }
      // A handler: interrupt a blocking call; it runs when the process resumes.
      if (p.state === "blocked" && p.wait && !p.wait.stopped) this.resume(p, p.wait.intr(), true);
      return;
    }
  }

  private stopped(p: Process, sig: number) {
    p.stopReport = sig;
    p.continueReport = false;
    this.notifyParent(p);
  }

  private notifyParent(p: Process) {
    const parent = this.procs.get(p.ppid);
    if (parent && parent.pid !== 1) this.post(parent, SIG.CHLD);
    this.wake();
  }

  /** Sends a signal to one process. */
  post(p: Process, sig: number) {
    if (p.state === "zombie" || p.pid === 1 || sig === 0) return;
    if (sig === SIG.CONT) {
      p.pending &= ~(sigbit(SIG.STOP) | sigbit(SIG.TSTP) | sigbit(SIG.TTIN) | sigbit(SIG.TTOU));
      if (p.state === "stopped") {
        p.state = p.resumeState;
        p.stopReport = 0;
        p.continueReport = true;
        if (p.state === "runnable") this.enqueue(p);
        this.notifyParent(p);
      }
    } else if (sig === SIG.STOP || sig === SIG.TSTP || sig === SIG.TTIN || sig === SIG.TTOU) {
      p.pending &= ~sigbit(SIG.CONT);
    }
    if (p.discards(sig)) return;
    p.pending |= sigbit(sig);
    this.wake();
  }

  /** kill(2) targets. Returns 0 or -ESRCH. */
  kill(from: Process, pid: number, sig: number): number {
    let targets: Process[];
    if (pid > 0) targets = [...this.procs.values()].filter((p) => p.pid === pid);
    else if (pid === 0) targets = this.group(from.pgid);
    else if (pid === -1) targets = [...this.procs.values()].filter((p) => p.pid !== 1 && p !== from);
    else targets = this.group(-pid);
    targets = targets.filter((p) => p.state !== "zombie" || pid > 0);
    if (!targets.length) return -E.ESRCH;
    // init (pid 1) accepts signals and drops them, as on Linux: it has no handlers.
    for (const p of targets) this.post(p, sig);
    return 0;
  }

  group(pgid: number) {
    return [...this.procs.values()].filter((p) => p.pgid === pgid && p.state !== "zombie" && p.pid !== 1);
  }

  killGroup(pgid: number, sig: number) {
    for (const p of this.group(pgid)) this.post(p, sig);
  }

  // ---- process lifetime ----

  /** vfork(): the child shares the image until it execs or exits. */
  vfork(img: Image): number {
    const parent = img.current;
    if (img.vforkDepth >= MAX_VFORK_DEPTH) return -E.EAGAIN;
    let live = 0;
    for (const p of this.procs.values()) if (p.state !== "zombie") live++;
    if (live >= MAX_PROCS) return -E.EAGAIN;
    const c = new Process(this.nextPid++, parent.pid, parent.cwd);
    c.pgid = parent.pgid;
    c.sid = parent.sid;
    c.umask = parent.umask;
    c.mask = parent.mask;
    c.disp.set(parent.disp);
    c.env = parent.env;
    c.argv = parent.argv;
    c.comm = parent.comm;
    c.fds = parent.cloneFds();
    c.vforkParent = parent;
    c.state = "vfork";
    parent.state = "vfork";
    this.procs.set(c.pid, c);
    img.pendingVfork = c;
    img.onChildFault ??= (child, e) => {
      this.exitProcess(child, this.faultStatus(child, e));
      this.endVfork(child);
    };
    img.unwind();
    return 0;
  }

  private endVfork(child: Process) {
    const parent = child.vforkParent!;
    child.vforkParent = undefined;
    // The parent may itself be a vfork child that is running again.
    parent.state = parent.vforkParent ? "vfork" : "runnable";
  }

  /** exit/_exit/proc_exit. Never returns. */
  exit(img: Image, code: number, flush: boolean): never {
    const p = img.current;
    if (img.inVforkChild) {
      this.exitProcess(p, exitedStatus(code));
      this.endVfork(p);
      throw new VforkDone();
    }
    if (flush && !p.exiting) {
      p.exiting = true;
      img.flushOnExit();
    }
    throw new ExitSignal(exitedStatus(code));
  }

  exitProcess(p: Process, status: number, respawn = true) {
    if (p.state === "zombie" || p.pid === 1) return;
    p.closeAll();
    p.image = undefined;
    p.wait = undefined;
    p.state = "zombie";
    p.status = status;
    p.alarmAt = 0;
    p.pending = 0n;
    this.queued.delete(p);
    for (const c of this.procs.values()) {
      if (c.ppid !== p.pid) continue;
      c.ppid = 1;
      if (c.state === "zombie") this.reap(c);
    }
    if (p.pid === p.sid && this.tty.sid === p.sid) {
      // The session leader is gone: hang up its session.
      for (const q of this.procs.values()) {
        if (q.sid === p.sid && q !== p && q.state !== "zombie") {
          this.post(q, SIG.HUP);
          this.post(q, SIG.CONT);
        }
      }
      this.tty.sid = 0;
      this.tty.fgPgrp = 0;
    }
    const parent = this.procs.get(p.ppid);
    if (!parent || parent.pid === 1) this.reap(p);
    else this.post(parent, SIG.CHLD);
    this.wake();
    if (p.pid === this.loginPid && respawn) {
      this.loginPid = 0;
      if (this.opts.onLogout?.(status) !== false) this.spawnLogin();
    }
  }

  private reap(c: Process) {
    const parent = this.procs.get(c.ppid);
    if (parent) parent.childCpuMs += c.cpuMs + c.childCpuMs;
    this.procs.delete(c.pid);
  }

  /** wait4: returns pid, 0 (WNOHANG), -ECHILD, or BLOCK. */
  wait4(p: Process, pid: number, options: number, report: (pid: number, status: number, c: Process) => void): number {
    let any = false;
    for (const c of this.procs.values()) {
      if (c.ppid !== p.pid || c.vforkParent) continue;
      if (pid > 0 ? c.pid !== pid : pid === 0 ? c.pgid !== p.pgid : pid < -1 ? c.pgid !== -pid : false) continue;
      any = true;
      if (c.state === "zombie") {
        report(c.pid, c.status, c);
        this.reap(c);
        return c.pid;
      }
      if (options & 2 && c.stopReport) {
        report(c.pid, stoppedStatus(c.stopReport), c);
        c.stopReport = 0;
        return c.pid;
      }
      if (options & 8 && c.continueReport) {
        report(c.pid, CONTINUED_STATUS, c);
        c.continueReport = false;
        return c.pid;
      }
    }
    if (!any) return -E.ECHILD;
    return options & 1 ? 0 : BLOCK;
  }

  // ---- exec ----

  /**
   * Resolves an executable and builds its new image without touching the
   * process. Returns the image or -errno.
   */
  /** `path` is text (resolved in the Vfs); `argv` are byte strings. */
  loadProgram(p: Process, path: string, argv: string[], depth = 0): Image | number {
    let inode: Inode;
    try {
      inode = this.vfs.resolve(p.cwd, path).inode;
    } catch (e) {
      if (e instanceof KError) return -e.code;
      throw e;
    }
    if (inode.isDir()) return -E.EACCES;
    if (!inode.exe && (!inode.isReg() || !(inode.mode & 0o111))) return -E.EACCES;
    if (!inode.exe) {
      if (depth > 4) return -E.ELOOP;
      const head = new TextDecoder().decode(inode.data.subarray(0, Math.min(inode.size, 256)));
      if (head.startsWith("#!")) {
        const line = head.slice(2).split("\n")[0].trim();
        const sp = line.search(/\s/);
        const interp = sp < 0 ? line : line.slice(0, sp);
        const arg = sp < 0 ? "" : line.slice(sp).trim();
        if (!interp) return -E.ENOEXEC;
        const extra = [interp, ...(arg ? [arg] : []), path].map(utf8ToBin);
        return this.loadProgram(p, interp, [...extra, ...argv.slice(1)], depth + 1);
      }
      // No #!: run it with the shell, as execvp does on ENOEXEC.
      return this.loadProgram(p, "/bin/sh", ["sh", utf8ToBin(path), ...argv.slice(1)], depth + 1);
    }
    const img = new Image(p, argv);
    try {
      img.instantiate(this.module, this.imports(img));
    } catch (e) {
      if (e instanceof WebAssembly.RuntimeError || e instanceof RangeError) return -E.ENOMEM;
      throw e;
    }
    img.exePath = path;
    return img;
  }

  private imports(img: Image): WebAssembly.Imports {
    const imports = makeImports(this, img);
    if (!this.importsChecked) {
      const missing = WebAssembly.Module.imports(this.module).filter(
        (i) => typeof (imports[i.module] as Record<string, unknown> | undefined)?.[i.name] !== "function",
      );
      if (missing.length) throw new Error("kernel lacks imports: " + missing.map((i) => i.module + "." + i.name).join(", "));
      this.importsChecked = true;
    }
    return imports;
  }

  /** Makes a loaded image the process's own: argv, comm, signal reset, cloexec. */
  commitExec(p: Process, img: Image) {
    p.image = img;
    img.owner = img.current = p;
    p.argv = img.argv;
    p.comm = (img.exePath ?? img.argv[0] ?? "").split("/").pop()!.slice(0, 15);
    for (let s = 1; s <= 64; s++) if (p.disp[s] >= DISP.HANDLER) p.disp[s] = DISP.DEFAULT;
    p.closeOnExec();
    p.exiting = false;
  }

  /** execve import. Returns -errno on failure, otherwise throws. */
  execve(img: Image, path: string, argv: string[], envp: string[]): number {
    const p = img.current;
    const next = this.loadProgram(p, path, argv);
    if (typeof next === "number") return next;
    p.env = envp;
    this.commitExec(p, next);
    if (img.inVforkChild) {
      this.endVfork(p);
      p.state = "runnable";
      this.enqueue(p);
      throw new VforkDone();
    }
    throw new ExecSignal(next);
  }

  // ---- helpers for syscalls ----

  ttyFor = () => this.tty;

  open(inode: Inode, flags: number): OpenFile {
    return openInode(this.vfs, inode, flags, this.ttyFor);
  }

  uptime() {
    return (Date.now() - this.bootTime) / 1000;
  }

  signalName(sig: number) {
    return SIGNAL_NAMES[sig] ?? "SIG" + sig;
  }

  isFifo(inode: Inode) {
    return (inode.mode & S.IFMT) === S.IFIFO;
  }

  /** The mask a process may set (KILL and STOP can't be blocked). */
  static maskable(mask: bigint) {
    return BigInt.asUintN(64, mask) & KILLABLE;
  }
}

export type { Wait };
