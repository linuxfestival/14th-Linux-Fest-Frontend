// Open file descriptions (shared by dup'd and inherited descriptors) and the
// read/write/poll behaviour of each kind of file.
import { E, O, POLL, S } from "./constants.ts";
import { BLOCK, Tty, type TtyCaller } from "./tty.ts";
import { Inode, KError, Vfs, toBytes } from "./vfs.ts";

export const PIPE_CAPACITY = 65536;

export class Pipe {
  private buf = new Uint8Array(PIPE_CAPACITY);
  private start = 0;
  len = 0;
  readers = 0;
  writers = 0;
  /** Named pipes (mkfifo): opens of each side so far. A reader that has
   * never seen a writer waits for one instead of reading EOF, and vice
   * versa, like open(2) on a FIFO (which can't block here). */
  named = false;
  readerOpens = 0;
  writerOpens = 0;
  /** Bytes written by a process that is exiting may exceed the capacity. */
  private overflow: Uint8Array[] = [];

  read(dst: Uint8Array, nonblock: boolean): number {
    if (this.len === 0) {
      if (this.writers === 0) return 0;
      return nonblock ? -E.EAGAIN : BLOCK;
    }
    const n = Math.min(dst.length, this.len);
    const first = Math.min(n, PIPE_CAPACITY - this.start);
    dst.set(this.buf.subarray(this.start, this.start + first));
    if (n > first) dst.set(this.buf.subarray(0, n - first), first);
    this.start = (this.start + n) % PIPE_CAPACITY;
    this.len -= n;
    while (this.overflow.length && this.len < PIPE_CAPACITY) {
      const chunk = this.overflow[0];
      const w = this.push(chunk);
      if (w === chunk.length) this.overflow.shift();
      else this.overflow[0] = chunk.subarray(w);
    }
    return n;
  }

  private push(src: Uint8Array): number {
    const n = Math.min(src.length, PIPE_CAPACITY - this.len);
    const end = (this.start + this.len) % PIPE_CAPACITY;
    const first = Math.min(n, PIPE_CAPACITY - end);
    this.buf.set(src.subarray(0, first), end);
    if (n > first) this.buf.set(src.subarray(first, n), 0);
    this.len += n;
    return n;
  }

  /** Returns bytes written, -EPIPE with no readers, or BLOCK when full. */
  write(src: Uint8Array, nonblock: boolean, force: boolean): number {
    if (this.readers === 0) return -E.EPIPE;
    if (src.length === 0) return 0;
    if (force) {
      const w = this.push(src);
      if (w < src.length) this.overflow.push(src.slice(w));
      return src.length;
    }
    if (this.len === PIPE_CAPACITY) return nonblock ? -E.EAGAIN : BLOCK;
    return this.push(src);
  }

  poll(isWrite: boolean): number {
    if (isWrite) {
      if (this.readers === 0) return POLL.ERR | POLL.OUT;
      return this.len < PIPE_CAPACITY ? POLL.OUT : 0;
    }
    let r = this.len > 0 ? POLL.IN : 0;
    if (this.writers === 0) r |= POLL.HUP;
    return r;
  }
}

export type FileKind = "reg" | "dir" | "pipe" | "tty" | "null" | "zero" | "full" | "random";

export interface DirEntry {
  name: string;
  ino: number;
  type: number;
}

export interface IoContext {
  caller: TtyCaller;
  /** The writer is exiting: never block (flushing stdio from exit()). */
  exiting: boolean;
  wait: { until?: number; started?: number };
}

export class OpenFile {
  inode: Inode;
  flags: number;
  kind: FileKind;
  pos = 0;
  refs = 1;
  pipe?: Pipe;
  tty?: Tty;
  /** Named pipes: the peer's open count when this end was opened. */
  fifoMark = 0;
  /** Snapshot of a generated (procfs) file, taken at open. */
  content?: Uint8Array;
  dirents?: DirEntry[];
  private vfs: Vfs;

  constructor(vfs: Vfs, inode: Inode, flags: number, kind: FileKind) {
    this.vfs = vfs;
    this.inode = inode;
    this.flags = flags;
    this.kind = kind;
    vfs.openCount.set(inode, (vfs.openCount.get(inode) ?? 0) + 1);
  }

  get readable() {
    return (this.flags & O.ACCMODE) !== O.WRONLY;
  }
  get writable() {
    return (this.flags & O.ACCMODE) !== O.RDONLY;
  }
  get nonblock() {
    return (this.flags & O.NONBLOCK) !== 0;
  }

  static pipeEnd(vfs: Vfs, pipe: Pipe, inode: Inode, write: boolean, flags: number) {
    const f = Object.create(OpenFile.prototype) as OpenFile;
    f.vfs = vfs;
    f.inode = inode;
    f.flags = (flags & ~O.ACCMODE) | (write ? O.WRONLY : O.RDONLY);
    f.kind = "pipe";
    f.pos = 0;
    f.refs = 1;
    f.pipe = pipe;
    if (write) {
      pipe.writers++;
      pipe.writerOpens++;
      f.fifoMark = pipe.readers ? -1 : pipe.readerOpens;
    } else {
      pipe.readers++;
      pipe.readerOpens++;
      f.fifoMark = pipe.writers ? -1 : pipe.writerOpens;
    }
    vfs.openCount.set(inode, (vfs.openCount.get(inode) ?? 0) + 1);
    return f;
  }

  release(): boolean {
    if (--this.refs > 0) return false;
    if (this.pipe) {
      if (this.writable) this.pipe.writers--;
      if (this.readable) this.pipe.readers--;
    }
    const n = (this.vfs.openCount.get(this.inode) ?? 1) - 1;
    if (n <= 0) this.vfs.openCount.delete(this.inode);
    else this.vfs.openCount.set(this.inode, n);
    this.vfs.maybeFree(this.inode);
    return true;
  }

  read(dst: Uint8Array, ctx: IoContext, at?: number): number {
    if (!this.readable) return -E.EBADF;
    switch (this.kind) {
      case "reg": {
        const src = this.content ?? this.inode.data.subarray(0, this.inode.size);
        const pos = at ?? this.pos;
        if (pos >= src.length) return 0;
        const n = Math.min(dst.length, src.length - pos);
        dst.set(src.subarray(pos, pos + n));
        if (at === undefined) this.pos += n;
        this.inode.atime = Date.now();
        return n;
      }
      case "dir":
        return -E.EISDIR;
      case "pipe":
        if (this.waitingForPeer()) return this.nonblock ? 0 : BLOCK;
        return this.pipe!.read(dst, this.nonblock);
      case "tty":
        return this.tty!.read(dst, ctx.caller, this.nonblock, ctx.wait);
      case "null":
        return 0;
      case "zero":
      case "full":
        dst.fill(0);
        return dst.length;
      case "random":
        for (let i = 0; i < dst.length; i += 65536) crypto.getRandomValues(dst.subarray(i, i + 65536));
        return dst.length;
    }
  }

  write(src: Uint8Array, ctx: IoContext, at?: number): number {
    if (!this.writable) return -E.EBADF;
    switch (this.kind) {
      case "reg": {
        if (this.content) return -E.EACCES; // generated files are read-only
        let pos = at ?? this.pos;
        if (this.flags & O.APPEND && at === undefined) pos = this.inode.size;
        try {
          this.vfs.writeAt(this.inode, pos, src);
        } catch (e) {
          if (e instanceof KError) return -e.code;
          throw e;
        }
        if (at === undefined) this.pos = pos + src.length;
        return src.length;
      }
      case "dir":
        return -E.EISDIR;
      case "pipe":
        if (this.waitingForPeer()) return this.nonblock || ctx.exiting ? -E.EAGAIN : BLOCK;
        return this.pipe!.write(src, this.nonblock, ctx.exiting);
      case "tty":
        if (ctx.exiting) {
          this.tty!.write(src, ctx.caller, true);
          return src.length;
        }
        return this.tty!.write(src, ctx.caller, this.nonblock);
      case "null":
      case "zero":
      case "random":
        return src.length;
      case "full":
        return -E.ENOSPC;
    }
  }

  /** A FIFO end whose other side has not been opened yet. */
  private waitingForPeer() {
    const p = this.pipe!;
    if (!p.named || (this.flags & O.ACCMODE) === O.RDWR) return false;
    return this.writable ? p.readers === 0 && p.readerOpens === this.fifoMark : p.writers === 0 && p.writerOpens === this.fifoMark;
  }

  poll(): number {
    switch (this.kind) {
      case "pipe":
        if (this.waitingForPeer()) return 0;
        return this.pipe!.poll(this.writable);
      case "tty":
        return this.tty!.poll();
      default:
        return POLL.IN | POLL.OUT;
    }
  }

  seek(offset: number, whence: number): number {
    if (this.kind === "pipe" || this.kind === "tty") return -E.ESPIPE;
    let base = 0;
    if (whence === 1) base = this.pos;
    else if (whence === 2) base = this.kind === "dir" ? (this.dirents?.length ?? 0) : this.size();
    else if (whence !== 0) return -E.EINVAL;
    const pos = base + offset;
    if (pos < 0) return -E.EINVAL;
    this.pos = pos;
    if (this.kind === "dir" && pos === 0) this.dirents = undefined;
    return pos;
  }

  size() {
    return this.content ? this.content.length : this.inode.size;
  }
}

/** Builds the open file description for an inode. */
export function openInode(vfs: Vfs, inode: Inode, flags: number, ttyFor: () => Tty | undefined): OpenFile {
  const type = inode.mode & S.IFMT;
  if (type === S.IFDIR) {
    if ((flags & O.ACCMODE) !== O.RDONLY) throw new KError(E.EISDIR);
    return new OpenFile(vfs, inode, flags, "dir");
  }
  if (flags & O.DIRECTORY) throw new KError(E.ENOTDIR);
  if (type === S.IFCHR) {
    const kind = inode.dev!.kind;
    if (kind === "tty") {
      const tty = ttyFor();
      if (!tty) throw new KError(E.ENXIO);
      const f = new OpenFile(vfs, inode, flags, "tty");
      f.tty = tty;
      return f;
    }
    return new OpenFile(vfs, inode, flags, kind);
  }
  if (type === S.IFIFO) {
    // Named pipes: open never blocks here; a reader with no writer sees EOF.
    let pipe = inode.fifo as Pipe | undefined;
    if (!pipe) {
      pipe = new Pipe();
      pipe.named = true;
      inode.fifo = pipe;
    }
    const acc = flags & O.ACCMODE;
    if (acc === O.RDWR) {
      const f = OpenFile.pipeEnd(vfs, pipe, inode, true, flags);
      pipe.readers++;
      pipe.readerOpens++;
      f.flags = (f.flags & ~O.ACCMODE) | O.RDWR;
      return f;
    }
    return OpenFile.pipeEnd(vfs, pipe, inode, acc === O.WRONLY, flags);
  }
  const f = new OpenFile(vfs, inode, flags, "reg");
  if (inode.generate) f.content = toBytes(inode.generate());
  return f;
}
