// One BusyBox process image: a WebAssembly instance driven with Asyncify.
//
// A blocking import unwinds the wasm stack into a buffer and returns to
// step(); the scheduler later rewinds it by calling main again, and the
// import returns the result the kernel stored in `rewindValue`.
// vfork snapshots that buffer so the same unwound stack can be rewound twice:
// first as the child (vfork returns 0), then as the parent (child pid).
import type { Process } from "./process.ts";

const ASYNC_SIZE = 128 * 1024;
export const UNWINDING = 1;
export const REWINDING = 2;

export interface BusyboxExports {
  memory: WebAssembly.Memory;
  __indirect_function_table: WebAssembly.Table;
  __wasm_call_ctors(): void;
  __main_argc_argv(argc: number, argv: number): number;
  __funcs_on_exit(): void;
  fflush(f: number): number;
  malloc(n: number): number;
  free(p: number): void;
  emscripten_builtin_memalign(align: number, n: number): number;
  setThrew(a: number, b: number): void;
  _emscripten_stack_alloc(n: number): number;
  _emscripten_stack_restore(sp: number): void;
  emscripten_stack_get_current(): number;
  bbw_deliver(sig: number): void;
  bbw_sigsave(): void;
  bbw_sigrestore(): void;
  bbw_setup(mask: bigint, ignored: bigint): void;
  asyncify_start_unwind(p: number): void;
  asyncify_stop_unwind(): void;
  asyncify_start_rewind(p: number): void;
  asyncify_stop_rewind(): void;
  asyncify_get_state(): number;
}

/** proc_exit/exit: the process image ends with this wait status. */
export class ExitSignal {
  status: number;
  constructor(status: number) {
    this.status = status;
  }
}
/** execve succeeded outside vfork: replace the image. */
export class ExecSignal {
  image: Image;
  constructor(image: Image) {
    this.image = image;
  }
}
/** The vfork child exec'd or exited: resume the parent. */
export class VforkDone {}
export class LongjmpSignal {}

export type StepResult =
  | { kind: "suspended" }
  | { kind: "exit"; status: number; returned?: boolean }
  | { kind: "exec"; image: Image };

const enc = new TextEncoder();
const dec = new TextDecoder();

// argv and environment strings are bytes, not text: BusyBox, for one, marks a
// re-exec by setting the high bit of argv[0][0]. The kernel keeps them as
// "byte strings" (one char per byte) and converts only at the edges.
export const bytesToBin = (b: Uint8Array) => {
  let s = "";
  for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192));
  return s;
};
export const binToBytes = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));
export const utf8ToBin = (s: string) => bytesToBin(enc.encode(s));

export class Image {
  exports!: BusyboxExports;
  owner: Process;
  /** The process syscalls act for: the vfork child while it runs. */
  current: Process;
  /** Byte strings (see bytesToBin). */
  argv: string[];
  /** The path that was exec'd (for comm and /proc/<pid>/exe). */
  exePath?: string;
  private argc = 0;
  private argvPtr = 0;
  private asyncBuf = 0;
  private started = false;
  rewinding = false;
  rewindValue: number | bigint = 0;
  /** Set by the vfork import before it unwinds. */
  pendingVfork?: Process;
  /** One saved stack per active vfork, innermost last (a vfork child may vfork). */
  private vforkSnaps: { bytes: Uint8Array; sp: number; parent: Process; child: Process }[] = [];
  /** The kernel's handler for a trap in a vfork child (the parent survives). */
  onChildFault?: (child: Process, err: unknown) => void;
  private buf?: ArrayBuffer;
  private view!: DataView;
  private bytes!: Uint8Array;

  constructor(owner: Process, argv: string[]) {
    this.owner = this.current = owner;
    this.argv = argv;
  }

  instantiate(module: WebAssembly.Module, imports: WebAssembly.Imports) {
    const instance = new WebAssembly.Instance(module, imports);
    this.exports = instance.exports as unknown as BusyboxExports;
  }

  // ---- memory ----

  dv(): DataView {
    const b = this.exports.memory.buffer;
    if (b !== this.buf) {
      this.buf = b as ArrayBuffer;
      this.view = new DataView(b);
      this.bytes = new Uint8Array(b);
    }
    return this.view;
  }
  u8(): Uint8Array {
    this.dv();
    return this.bytes;
  }
  str(ptr: number, max = Infinity): string {
    const m = this.u8();
    let end = ptr;
    while (m[end] && end - ptr < max) end++;
    return dec.decode(m.subarray(ptr, end));
  }
  /** A NULL-terminated char*[] (argv, envp) as byte strings. */
  strArray(ptr: number): string[] {
    const out: string[] = [];
    if (!ptr) return out;
    const dv = this.dv();
    const m = this.u8();
    for (let p; (p = dv.getUint32(ptr, true)); ptr += 4) {
      let end = p;
      while (m[end]) end++;
      out.push(bytesToBin(m.subarray(p, end)));
    }
    return out;
  }
  /** Writes a NUL-terminated string, truncated to fit `size`. Returns bytes written without the NUL. */
  writeStr(ptr: number, s: string, size: number): number {
    if (size <= 0) return 0;
    const b = enc.encode(s).subarray(0, size - 1);
    const m = this.u8();
    m.set(b, ptr);
    m[ptr + b.length] = 0;
    return b.length;
  }

  // ---- Asyncify ----

  get state() {
    return this.exports.asyncify_get_state();
  }

  /** Called from a blocking import: suspend and return to step(). */
  unwind() {
    const dv = this.dv();
    dv.setUint32(this.asyncBuf, this.asyncBuf + 8, true);
    dv.setUint32(this.asyncBuf + 4, this.asyncBuf + ASYNC_SIZE, true);
    this.exports.asyncify_start_unwind(this.asyncBuf);
  }

  /** In a blocking import while rewinding: returns the stored result. */
  finishRewind(): number | bigint {
    this.exports.asyncify_stop_rewind();
    this.rewinding = false;
    return this.rewindValue;
  }

  private start() {
    const x = this.exports;
    x.__wasm_call_ctors();
    let ignored = 0n;
    for (let s = 1; s <= 64; s++) if (this.owner.disp[s] === 1) ignored |= 1n << BigInt(s - 1);
    x.bbw_setup(this.owner.mask, ignored);
    this.asyncBuf = x.malloc(ASYNC_SIZE);
    const strs = this.argv.map((a) => binToBytes(a + "\0"));
    const total = strs.reduce((n, s) => n + s.length, 0);
    let p = x._emscripten_stack_alloc((total + 3) & ~3);
    this.argvPtr = x._emscripten_stack_alloc((strs.length + 1) * 4);
    const dv = this.dv();
    const m = this.u8();
    strs.forEach((s, i) => {
      m.set(s, p);
      dv.setUint32(this.argvPtr + i * 4, p, true);
      p += s.length;
    });
    dv.setUint32(this.argvPtr + strs.length * 4, 0, true);
    this.argc = strs.length;
    this.started = true;
  }

  /** Runs until the image suspends, exits or execs. Other exceptions
   * (traps, termination by signal) propagate to the kernel. */
  step(): StepResult {
    const x = this.exports;
    for (;;) {
      let ret: number;
      try {
        if (!this.started) this.start();
        else if (this.rewinding) x.asyncify_start_rewind(this.asyncBuf);
        ret = x.__main_argc_argv(this.argc, this.argvPtr);
      } catch (e) {
        if (e instanceof VforkDone) {
          this.resumeVforkParent();
          continue;
        }
        if (e instanceof ExitSignal) return { kind: "exit", status: e.status };
        if (e instanceof ExecSignal) return { kind: "exec", image: e.image };
        if (this.inVforkChild && this.onChildFault) {
          this.onChildFault(this.current, e);
          this.resumeVforkParent();
          continue;
        }
        throw e;
      }
      if (x.asyncify_get_state() === UNWINDING) {
        x.asyncify_stop_unwind();
        const child = this.pendingVfork;
        if (child) {
          // Save the unwound stack, then rewind it as the child.
          this.pendingVfork = undefined;
          x.bbw_sigsave();
          const used = this.dv().getUint32(this.asyncBuf, true) - this.asyncBuf;
          this.vforkSnaps.push({
            bytes: this.u8().slice(this.asyncBuf, this.asyncBuf + used),
            sp: x.emscripten_stack_get_current(),
            parent: this.current,
            child,
          });
          this.current = child;
          this.rewinding = true;
          this.rewindValue = 0;
          continue;
        }
        this.rewinding = true;
        return { kind: "suspended" };
      }
      return { kind: "exit", status: (ret & 0xff) << 8, returned: true };
    }
  }

  get inVforkChild() {
    return this.current !== this.owner;
  }

  /** Depth of nested vforks currently running in this image. */
  get vforkDepth() {
    return this.vforkSnaps.length;
  }

  private resumeVforkParent() {
    const snap = this.vforkSnaps.pop()!;
    this.u8().set(snap.bytes, this.asyncBuf);
    this.exports._emscripten_stack_restore(snap.sp);
    this.exports.bbw_sigrestore();
    this.current = snap.parent;
    this.rewinding = true;
    this.rewindValue = snap.child.pid;
  }

  /** Runs atexit handlers and flushes stdio (exit(), or main returning). */
  flushOnExit() {
    try {
      this.exports.__funcs_on_exit();
      this.exports.fflush(0);
    } catch (e) {
      if (!(e instanceof ExitSignal)) throw e;
    }
  }
}
