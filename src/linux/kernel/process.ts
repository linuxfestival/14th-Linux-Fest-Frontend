// Process state: ids, descriptors, signal dispositions and the wait status
// encoding. Wait semantics follow ai-ecoverse/slicc-kernel src/kernel/children.ts
// (Apache-2.0, commit 0a84484), adapted to a single-threaded kernel.
import { E, SIG, SIG_IGNORED_BY_DEFAULT, SIG_STOPS } from "./constants.ts";
import type { OpenFile } from "./files.ts";
import type { TtyCaller } from "./tty.ts";
import type { Inode } from "./vfs.ts";
import type { Image } from "./image.ts";

export const MAX_FDS = 256;

export const DISP = { DEFAULT: 0, IGNORE: 1, HANDLER: 2, HANDLER_RESTART: 3 } as const;

export type ProcState = "runnable" | "blocked" | "stopped" | "zombie" | "vfork";

export const exitedStatus = (code: number) => (code & 0xff) << 8;
export const signaledStatus = (sig: number) => sig & 0x7f;
export const stoppedStatus = (sig: number) => ((sig & 0xff) << 8) | 0x7f;
export const CONTINUED_STATUS = 0xffff;

export const sigbit = (sig: number) => 1n << BigInt(sig - 1);

export interface FdEntry {
  file: OpenFile;
  cloexec: boolean;
}

/** What a blocked process waits for. `check` returns the import's result, or
 * BLOCK if not ready yet. `intr` gives the result when a signal interrupts it. */
export interface Wait {
  check: () => number;
  intr: () => number;
  /** Date.now() ms at which `check` will stop returning BLOCK. */
  deadline?: () => number | undefined;
  /** The process stopped inside an import; only SIGCONT ends this wait. */
  stopped?: boolean;
}

export class Process implements TtyCaller {
  pid: number;
  ppid: number;
  pgid: number;
  sid: number;
  state: ProcState = "runnable";
  /** Linux wait status once a zombie. */
  status = 0;
  fds: (FdEntry | undefined)[] = [];
  cwd: Inode;
  umask = 0o022;
  argv: string[] = [];
  env: string[] = [];
  comm = "";
  disp = new Uint8Array(65);
  mask = 0n;
  pending = 0n;
  image?: Image;
  wait?: Wait;
  /** Set while this process is a vfork child running in its parent's image. */
  vforkParent?: Process;
  /** Report for wait4: stop signal not yet reported, or a continue. */
  stopReport = 0;
  continueReport = false;
  /** State to return to when continued. */
  resumeState: ProcState = "runnable";
  cpuMs = 0;
  childCpuMs = 0;
  startTime = performance.now();
  exiting = false;
  inHandler = 0;
  /** Woken from a blocking call by a signal. */
  interrupted = false;
  /** Date.now() deadlines of a pending alarm() and of nanosleep. */
  alarmAt = 0;
  sleepEnd = 0;

  constructor(pid: number, ppid: number, cwd: Inode) {
    this.pid = this.pgid = this.sid = pid;
    this.ppid = ppid;
    this.cwd = cwd;
  }

  ignoresSignal(sig: number) {
    return this.disp[sig] === DISP.IGNORE || (this.mask & sigbit(sig)) !== 0n;
  }

  /** True if delivering sig would do nothing at all. */
  discards(sig: number) {
    if (sig === SIG.KILL || sig === SIG.STOP || sig === SIG.CONT) return false;
    if (this.disp[sig] === DISP.IGNORE) return true;
    return this.disp[sig] === DISP.DEFAULT && SIG_IGNORED_BY_DEFAULT.has(sig);
  }

  /** Lowest pending, unblocked signal, or 0. SIGKILL first. */
  nextSignal(): number {
    const ready = this.pending & ~this.mask;
    if (!ready) return 0;
    if (ready & sigbit(SIG.KILL)) return SIG.KILL;
    for (let s = 1; s <= 64; s++) if (ready & sigbit(s)) return s;
    return 0;
  }

  /** What the default action of sig is, if the disposition is default. */
  static defaultAction(sig: number): "term" | "ignore" | "stop" | "cont" {
    if (sig === SIG.CONT) return "cont";
    if (SIG_STOPS.has(sig)) return "stop";
    if (SIG_IGNORED_BY_DEFAULT.has(sig)) return "ignore";
    return "term";
  }

  // ---- descriptors ----

  fd(n: number): OpenFile | undefined {
    return n >= 0 ? this.fds[n]?.file : undefined;
  }

  allocFd(file: OpenFile, cloexec: boolean, min = 0): number {
    for (let i = min; i < MAX_FDS; i++) {
      if (!this.fds[i]) {
        this.fds[i] = { file, cloexec };
        return i;
      }
    }
    return -E.EMFILE;
  }

  closeFd(n: number): number {
    const e = n >= 0 ? this.fds[n] : undefined;
    if (!e) return -E.EBADF;
    this.fds[n] = undefined;
    e.file.release();
    return 0;
  }

  closeAll() {
    for (let i = 0; i < this.fds.length; i++) if (this.fds[i]) this.closeFd(i);
    this.fds = [];
  }

  /** Copies the descriptor table (vfork). */
  cloneFds(): (FdEntry | undefined)[] {
    return this.fds.map((e) => {
      if (!e) return undefined;
      e.file.refs++;
      return { file: e.file, cloexec: e.cloexec };
    });
  }

  closeOnExec() {
    for (let i = 0; i < this.fds.length; i++) if (this.fds[i]?.cloexec) this.closeFd(i);
  }
}
