// In-memory filesystem: inodes, directories, symlinks, hard links, FIFOs,
// character devices and generated (procfs-style) files and directories.
import { E, S } from "./constants.ts";

export class KError extends Error {
  code: number;
  constructor(code: number) {
    super("errno " + code);
    this.code = code;
  }
}

export const fail = (code: number): never => {
  throw new KError(code);
};

const MAX_SYMLINKS = 40;
const NAME_MAX = 255;
// All regular file contents together may use at most this much memory.
export const FS_CAPACITY = 64 * 1024 * 1024;

let nextIno = 2;

/** A character device; `open` returns the per-open state for it. */
export interface CharDevice {
  rdev: number;
  kind: "null" | "zero" | "full" | "random" | "tty";
}

/** Directory whose entries are computed on every lookup (e.g. /proc). */
export interface DynamicDir {
  list(): string[];
  lookup(name: string): Inode | undefined;
}

export class Inode {
  ino: number;
  mode: number;
  uid = 0;
  gid = 0;
  nlink = 1;
  atime: number;
  mtime: number;
  ctime: number;
  // regular files
  data: Uint8Array = EMPTY;
  size = 0;
  /** Marks the BusyBox executable; exec of this inode starts a new BusyBox image. */
  exe = false;
  /** Generated file: contents are produced fresh at open time. */
  generate?: () => string | Uint8Array;
  // directories
  children?: Map<string, Inode>;
  parent?: Inode;
  dynamic?: DynamicDir;
  // symlinks
  target?: string;
  /** Generated symlink target (e.g. /proc/self). */
  readTarget?: () => string;
  /** /proc/<pid>/fd/N: opening it reuses that descriptor's OpenFile, so
   * /dev/stdin works for pipes too. */
  fdTarget?: () => unknown;
  // devices and FIFOs
  dev?: CharDevice;
  fifo?: unknown;

  constructor(mode: number, ino?: number) {
    this.ino = ino ?? nextIno++;
    this.mode = mode;
    this.atime = this.mtime = this.ctime = Date.now();
  }

  get type() {
    return this.mode & S.IFMT;
  }
  isDir() {
    return this.type === S.IFDIR;
  }
  isReg() {
    return this.type === S.IFREG;
  }
  isLink() {
    return this.type === S.IFLNK;
  }
  linkTarget() {
    return this.readTarget ? this.readTarget() : (this.target ?? "");
  }
  touch() {
    this.mtime = this.ctime = Date.now();
  }
}

const EMPTY = new Uint8Array(0);
const enc = new TextEncoder();

export const toBytes = (s: string | Uint8Array) => (typeof s === "string" ? enc.encode(s) : s);

export interface Resolved {
  inode: Inode;
  parent: Inode;
  name: string;
}

export interface ResolvedParent {
  parent: Inode;
  name: string;
  inode?: Inode;
  trailingSlash: boolean;
}

export class Vfs {
  root: Inode;
  used = 0;

  constructor() {
    this.root = new Inode(S.IFDIR | 0o755, 1);
    this.root.children = new Map();
    this.root.parent = this.root;
    this.root.nlink = 2;
  }

  // ---- lookups ----

  lookupChild(dir: Inode, name: string): Inode | undefined {
    if (name === "." || name === "") return dir;
    if (name === "..") return dir.parent ?? dir;
    if (dir.dynamic) return dir.dynamic.lookup(name);
    return dir.children?.get(name);
  }

  listDir(dir: Inode): string[] {
    if (dir.dynamic) return dir.dynamic.list();
    return [...(dir.children?.keys() ?? [])];
  }

  /**
   * Resolves a path to its parent directory and final name, following symlinks
   * in the leading components. The final component is looked up but not
   * followed.
   */
  resolveParent(cwd: Inode, path: string, depth = 0): ResolvedParent {
    if (path === "") fail(E.ENOENT);
    let dir = path.startsWith("/") ? this.root : cwd;
    const trailingSlash = path.length > 1 && path.endsWith("/");
    const parts = path.split("/").filter((p) => p !== "");
    if (parts.length === 0) return { parent: dir.parent ?? dir, name: ".", inode: dir, trailingSlash };
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part.length > NAME_MAX) fail(E.ENAMETOOLONG);
      if (!dir.isDir()) fail(E.ENOTDIR);
      let next = this.lookupChild(dir, part);
      if (!next) fail(E.ENOENT);
      next = next!;
      if (next.isLink()) {
        if (depth >= MAX_SYMLINKS) fail(E.ELOOP);
        next = this.resolve(dir, next.linkTarget(), true, depth + 1).inode;
      }
      dir = next;
    }
    if (!dir.isDir()) fail(E.ENOTDIR);
    const name = parts[parts.length - 1];
    if (name.length > NAME_MAX) fail(E.ENAMETOOLONG);
    return { parent: dir, name, inode: this.lookupChild(dir, name), trailingSlash };
  }

  resolve(cwd: Inode, path: string, follow = true, depth = 0): Resolved {
    const r = this.resolveParent(cwd, path, depth);
    let inode = r.inode;
    if (!inode) fail(E.ENOENT);
    inode = inode!;
    if (inode.isLink() && (follow || r.trailingSlash)) {
      if (depth >= MAX_SYMLINKS) fail(E.ELOOP);
      return this.resolve(r.parent, inode.linkTarget(), true, depth + 1);
    }
    if (r.trailingSlash && !inode.isDir()) fail(E.ENOTDIR);
    return { inode, parent: r.parent, name: r.name };
  }

  /** Absolute path of a directory, for getcwd and /proc/<pid>/cwd. */
  pathOf(dir: Inode): string {
    const names: string[] = [];
    let cur = dir;
    for (let guard = 0; cur !== this.root && guard < 256; guard++) {
      const parent = cur.parent;
      if (!parent || parent === cur) break;
      let found: string | undefined;
      if (parent.children) {
        for (const [n, c] of parent.children) if (c === cur) found = n;
      } else if (parent.dynamic) {
        for (const n of parent.dynamic.list()) if (parent.dynamic.lookup(n)?.ino === cur.ino) found = n;
      }
      if (found === undefined) return "/(deleted)";
      names.push(found);
      cur = parent;
    }
    return "/" + names.reverse().join("/");
  }

  // ---- mutation ----

  private writableDir(dir: Inode) {
    if (!dir.isDir()) fail(E.ENOTDIR);
    if (!dir.children) fail(E.EACCES); // generated directories are read-only
  }

  link(dir: Inode, name: string, inode: Inode) {
    this.writableDir(dir);
    if (name === "." || name === "..") fail(E.EEXIST);
    if (dir.children!.has(name)) fail(E.EEXIST);
    dir.children!.set(name, inode);
    if (inode.isDir()) {
      inode.parent = dir;
      dir.nlink++;
    }
    dir.touch();
  }

  unlinkEntry(dir: Inode, name: string) {
    this.writableDir(dir);
    const inode = dir.children!.get(name);
    if (!inode) fail(E.ENOENT);
    dir.children!.delete(name);
    dir.touch();
    inode!.nlink--;
    inode!.ctime = Date.now();
    if (inode!.isDir()) dir.nlink--;
    this.maybeFree(inode!);
  }

  /** Releases file contents once there are no names left. Open descriptors keep
   * their own reference to the inode, so reads keep working until close. */
  openCount = new Map<Inode, number>();
  maybeFree(inode: Inode) {
    if (inode.nlink <= 0 && !this.openCount.get(inode) && inode.isReg()) {
      this.used -= inode.data.length;
      inode.data = EMPTY;
      inode.size = 0;
    }
  }

  mkdir(dir: Inode, name: string, mode: number): Inode {
    const d = new Inode(S.IFDIR | (mode & 0o7777));
    d.children = new Map();
    d.nlink = 2;
    this.link(dir, name, d);
    return d;
  }

  createFile(dir: Inode, name: string, mode: number): Inode {
    const f = new Inode(S.IFREG | (mode & 0o7777));
    this.link(dir, name, f);
    return f;
  }

  symlink(dir: Inode, name: string, target: string): Inode {
    const l = new Inode(S.IFLNK | 0o777);
    l.target = target;
    l.size = enc.encode(target).length;
    this.link(dir, name, l);
    return l;
  }

  // ---- regular file data ----

  reserve(inode: Inode, size: number) {
    if (size <= inode.data.length) return;
    let cap = Math.max(size, inode.data.length * 2, 256);
    if (this.used - inode.data.length + cap > FS_CAPACITY) cap = size;
    if (this.used - inode.data.length + cap > FS_CAPACITY) fail(E.ENOSPC);
    const next = new Uint8Array(cap);
    next.set(inode.data.subarray(0, inode.size));
    this.used += cap - inode.data.length;
    inode.data = next;
  }

  truncate(inode: Inode, size: number) {
    if (!inode.isReg()) fail(inode.isDir() ? E.EISDIR : E.EINVAL);
    if (size > inode.size) {
      this.reserve(inode, size);
      inode.data.fill(0, inode.size, size);
    } else if (size === 0 && inode.data.length > 4096) {
      this.used -= inode.data.length;
      inode.data = EMPTY;
    }
    inode.size = size;
    inode.touch();
  }

  writeAt(inode: Inode, pos: number, bytes: Uint8Array): number {
    const end = pos + bytes.length;
    if (end > inode.size) {
      this.reserve(inode, end);
      if (pos > inode.size) inode.data.fill(0, inode.size, pos);
      inode.size = end;
    }
    inode.data.set(bytes, pos);
    inode.touch();
    return bytes.length;
  }

  // ---- building the image ----

  mkdirp(path: string, mode = 0o755): Inode {
    let dir = this.root;
    for (const part of path.split("/").filter(Boolean)) {
      let next = dir.children?.get(part);
      if (!next) next = this.mkdir(dir, part, mode);
      dir = next;
    }
    return dir;
  }

  writeFile(path: string, content: string | Uint8Array, mode = 0o644): Inode {
    const slash = path.lastIndexOf("/");
    const dir = this.mkdirp(path.slice(0, slash));
    const name = path.slice(slash + 1);
    let f = dir.children!.get(name);
    if (!f) f = this.createFile(dir, name, mode);
    else f.mode = S.IFREG | mode;
    const bytes = toBytes(content);
    this.truncate(f, 0);
    this.writeAt(f, 0, bytes);
    return f;
  }

  addSymlink(path: string, target: string): Inode {
    const slash = path.lastIndexOf("/");
    const dir = this.mkdirp(path.slice(0, slash));
    const name = path.slice(slash + 1);
    if (dir.children!.has(name)) this.unlinkEntry(dir, name);
    return this.symlink(dir, name, target);
  }

  addDevice(path: string, kind: CharDevice["kind"], rdev: number, mode = 0o666): Inode {
    const slash = path.lastIndexOf("/");
    const dir = this.mkdirp(path.slice(0, slash));
    const d = new Inode(S.IFCHR | mode);
    d.dev = { kind, rdev };
    this.link(dir, path.slice(slash + 1), d);
    return d;
  }
}
