// Every import of busybox.wasm, implemented on top of the kernel, Vfs,
// OpenFile and Tty. Emscripten's own JS glue is not used.
//
// Conventions: env.__syscall_* return -errno; wasi_snapshot_preview1.* return
// a positive errno. Imports listed in ASYNCIFY_IMPORTS (build.sh) may suspend:
// they go through kernel.blocking() or kernel.finish(.., true).
import { AT, E, F, FILETYPE, IOCTL, O, PAGE, S, SIG } from "./constants.ts";
import { OpenFile, Pipe } from "./files.ts";
import { Image, LongjmpSignal, binToBytes } from "./image.ts";
import type { Kernel } from "./kernel.ts";
import { Kernel as K } from "./kernel.ts";
import { DISP, sigbit } from "./process.ts";
import { timeImports } from "./time.ts";
import { BLOCK } from "./tty.ts";
import { FS_CAPACITY, Inode, KError, fail } from "./vfs.ts";

const HEAP_MAX = 256 * 1024 * 1024;
export const MEM_TOTAL = 512 * 1024 * 1024;
const enc = new TextEncoder();

export const UTS = {
  sysname: "Linux",
  release: "6.12.14-linuxfest",
  version: "#15 SMP PREEMPT_DYNAMIC Linux Fest 15",
  machine: "wasm32",
};

export function direntType(inode: Inode) {
  switch (inode.mode & S.IFMT) {
    case S.IFDIR:
      return 4;
    case S.IFREG:
      return 8;
    case S.IFLNK:
      return 10;
    case S.IFCHR:
      return 2;
    case S.IFIFO:
      return 1;
  }
  return 0;
}

export function makeImports(k: Kernel, img: Image): WebAssembly.Imports {
  const vfs = k.vfs;
  const P = () => img.current;
  const dv = () => img.dv();
  const str = (p: number) => img.str(p);

  /** Wraps a -errno syscall: KError becomes -code; signals are delivered. */
  const sys =
    <A extends unknown[]>(fn: (...a: A) => number) =>
    (...a: A): number => {
      let r: number;
      try {
        r = fn(...a);
      } catch (e) {
        if (!(e instanceof KError)) throw e;
        r = -e.code;
      }
      return k.finish(img, r, false);
    };
  /** Same for WASI imports (positive errno). */
  const wasi =
    <A extends unknown[]>(fn: (...a: A) => number) =>
    (...a: A): number => {
      let r: number;
      try {
        r = fn(...a);
      } catch (e) {
        if (!(e instanceof KError)) throw e;
        r = e.code;
      }
      return k.finish(img, r, false);
    };
  const errno = (e: unknown, neg: boolean) => {
    if (!(e instanceof KError)) throw e;
    return neg ? -e.code : e.code;
  };

  const file = (fd: number): OpenFile => P().fd(fd) ?? fail(E.EBADF);

  /** Starting directory for a path relative to dirfd. */
  const base = (dirfd: number, path: string): Inode => {
    if (path.startsWith("/") || dirfd === AT.FDCWD) return P().cwd;
    const f = file(dirfd);
    if (!f.inode.isDir()) fail(E.ENOTDIR);
    return f.inode;
  };

  /** Follows symlinks of the final component, stopping at /proc/<pid>/fd links. */
  const resolveFinal = (dir: Inode, path: string, follow: boolean) => {
    for (let n = 0; ; n++) {
      const r = vfs.resolve(dir, path, false);
      if (!follow || !r.inode.isLink() || r.inode.fdTarget) return r;
      if (n >= 40) fail(E.ELOOP);
      dir = r.parent;
      path = r.inode.linkTarget();
    }
  };

  const lookup = (dirfd: number, path: string, follow = true) => resolveFinal(base(dirfd, path), path, follow).inode;

  const statSize = (inode: Inode, f?: OpenFile) => {
    if (f?.content) return f.content.length;
    if (inode.isLink()) return enc.encode(inode.linkTarget()).length;
    if (inode.generate) return 0;
    return inode.isReg() ? inode.size : inode.isDir() ? 4096 : 0;
  };

  const writeStat = (buf: number, inode: Inode, f?: OpenFile) => {
    const d = dv();
    const size = statSize(inode, f);
    d.setUint32(buf, inode.generate || inode.dynamic ? 3 : 0x801, true);
    d.setUint32(buf + 4, inode.mode, true);
    d.setUint32(buf + 8, inode.nlink, true);
    d.setUint32(buf + 12, inode.uid, true);
    d.setUint32(buf + 16, inode.gid, true);
    d.setUint32(buf + 20, inode.dev?.rdev ?? 0, true);
    d.setBigInt64(buf + 24, BigInt(size), true);
    d.setInt32(buf + 32, 4096, true);
    d.setInt32(buf + 36, Math.ceil(size / 512), true);
    const t = (o: number, ms: number) => {
      d.setBigInt64(buf + o, BigInt(Math.floor(ms / 1000)), true);
      d.setUint32(buf + o + 8, (ms % 1000) * 1e6, true);
    };
    t(40, inode.atime);
    t(56, inode.mtime);
    t(72, inode.ctime);
    d.setBigInt64(buf + 88, BigInt(inode.ino), true);
    return 0;
  };

  const iovecs = (iovs: number, n: number) => {
    const d = dv();
    const list: [number, number][] = [];
    let total = 0;
    for (let i = 0; i < n; i++) {
      const ptr = d.getUint32(iovs + i * 8, true);
      const len = d.getUint32(iovs + i * 8 + 4, true);
      list.push([ptr, len]);
      total += len;
    }
    return { list, total };
  };

  const ioctx = () => ({ caller: P(), exiting: !k.canSuspend(img), wait: {} as { until?: number; started?: number } });

  // ---- descriptors and I/O ----

  const fd_read = (fd: number, iovs: number, n: number, nread: number) => {
    const p = P();
    const f = p.fd(fd);
    if (!f) return k.finish(img, E.EBADF, true);
    const { list, total } = iovecs(iovs, n);
    const tmp = new Uint8Array(Math.min(total, 1 << 20));
    const ctx = ioctx();
    const op = () => {
      let r: number;
      try {
        r = f.read(tmp, ctx);
      } catch (e) {
        return errno(e, false);
      }
      if (r === BLOCK) return BLOCK;
      if (r < 0) return -r;
      const m = img.u8();
      let off = 0;
      for (const [ptr, len] of list) {
        if (off >= r) break;
        const c = Math.min(len, r - off);
        m.set(tmp.subarray(off, off + c), ptr);
        off += c;
      }
      dv().setUint32(nread, r, true);
      return 0;
    };
    return k.blocking(img, op, { intr: () => E.EINTR, restart: true, deadline: () => ctx.wait.until, nonblock: () => E.EAGAIN });
  };

  const fd_write = (fd: number, iovs: number, n: number, nwritten: number) => {
    const p = P();
    const f = p.fd(fd);
    if (!f) return k.finish(img, E.EBADF, true);
    const { list, total } = iovecs(iovs, n);
    const data = new Uint8Array(total);
    const m = img.u8();
    let off = 0;
    for (const [ptr, len] of list) {
      data.set(m.subarray(ptr, ptr + len), off);
      off += len;
    }
    const ctx = ioctx();
    const op = () => {
      let r: number;
      try {
        r = f.write(data, ctx);
      } catch (e) {
        return errno(e, false);
      }
      if (r === BLOCK) return BLOCK;
      if (r === -E.EPIPE) k.post(p, SIG.PIPE);
      if (r < 0) return -r;
      dv().setUint32(nwritten, r, true);
      return 0;
    };
    return k.blocking(img, op, { intr: () => E.EINTR, restart: true, nonblock: () => E.EAGAIN });
  };

  const pollOnce = (fds: number, nfds: number) => {
    const d = dv();
    const p = P();
    let count = 0;
    for (let i = 0; i < nfds; i++) {
      const at = fds + i * 8;
      const fd = d.getInt32(at, true);
      const events = d.getInt16(at + 4, true);
      let rev = 0;
      if (fd >= 0) {
        const f = p.fd(fd);
        rev = f ? f.poll() & (events | 8 | 16) : 32;
      }
      d.setInt16(at + 6, rev, true);
      if (rev) count++;
    }
    return count;
  };

  const dirents = (f: OpenFile) => {
    if (!f.dirents) {
      const dir = f.inode;
      const list = [
        { name: ".", ino: dir.ino, type: 4 },
        { name: "..", ino: (dir.parent ?? dir).ino, type: 4 },
      ];
      for (const name of vfs.listDir(dir)) {
        const c = vfs.lookupChild(dir, name);
        if (c) list.push({ name, ino: c.ino, type: direntType(c) });
      }
      f.dirents = list;
    }
    return f.dirents;
  };

  const unlink = (dirfd: number, path: string, flags: number) => {
    const r = vfs.resolveParent(base(dirfd, path), path);
    if (!r.inode) fail(E.ENOENT);
    const inode = r.inode!;
    if (flags & AT.REMOVEDIR) {
      if (r.name === ".") fail(E.EINVAL);
      if (inode === vfs.root) fail(E.EBUSY);
      if (!inode.isDir()) fail(E.ENOTDIR);
      if (vfs.listDir(inode).length) fail(E.ENOTEMPTY);
    } else if (inode.isDir()) fail(E.EISDIR);
    vfs.unlinkEntry(r.parent, r.name);
    return 0;
  };

  const setTimes = (inode: Inode, times: number) => {
    const now = Date.now();
    const read = (ptr: number) => {
      const nsec = dv().getInt32(ptr + 8, true);
      if (nsec === 0x3fffffff) return now; // UTIME_NOW
      if (nsec === 0x3ffffffe) return null; // UTIME_OMIT
      return Number(dv().getBigInt64(ptr, true)) * 1000 + Math.floor(nsec / 1e6);
    };
    const a = times ? read(times) : now;
    const m = times ? read(times + 16) : now;
    if (a !== null) inode.atime = a;
    if (m !== null) inode.mtime = m;
    inode.ctime = now;
  };

  const x = () => img.exports;
  const invoke =
    <R>(zero: R) =>
    (index: number, ...a: unknown[]): R => {
      const sp = x().emscripten_stack_get_current();
      try {
        return (x().__indirect_function_table.get(index) as (...a: unknown[]) => R)(...a);
      } catch (e) {
        x()._emscripten_stack_restore(sp);
        if (!(e instanceof LongjmpSignal)) throw e;
        x().setThrew(1, 0);
        return zero;
      }
    };

  const env: Record<string, unknown> = {
    ...timeImports(img),
    exit: (code: number) => k.exit(img, code, true),
    emscripten_get_now: () => performance.now(),
    emscripten_date_now: () => Date.now(),
    emscripten_get_heap_max: () => HEAP_MAX,
    emscripten_resize_heap(req: number) {
      req >>>= 0;
      const mem = x().memory;
      const old = mem.buffer.byteLength;
      if (req > HEAP_MAX) return 0;
      let size = Math.max(req, Math.min(old * 2, old + 64 * 1024 * 1024));
      size = Math.min(HEAP_MAX, Math.ceil(size / PAGE) * PAGE);
      try {
        mem.grow((size - old) / PAGE);
        return 1;
      } catch {
        return 0;
      }
    },
    _mmap_js: sys((len: number, _prot: number, _flags: number, fd: number, offset: bigint, allocated: number, addr: number) => {
      const f = file(fd);
      if (f.kind !== "reg") return -E.ENODEV;
      const ptr = x().emscripten_builtin_memalign(PAGE, len);
      if (!ptr) return -E.ENOMEM;
      const m = img.u8();
      m.fill(0, ptr, ptr + len);
      const src = f.content ?? f.inode.data.subarray(0, f.inode.size);
      const o = Number(offset);
      if (o < src.length) m.set(src.subarray(o, Math.min(src.length, o + len)), ptr);
      dv().setInt32(allocated, 1, true);
      dv().setUint32(addr, ptr, true);
      return 0;
    }),
    _emscripten_system: (cmd: number) => (cmd ? -E.ENOSYS : 0),
    _emscripten_lookup_name: (name: number) => lookupHost(k, str(name)),
    _emscripten_throw_longjmp: () => {
      throw new LongjmpSignal();
    },
    invoke_v: invoke(undefined),
    invoke_vi: invoke(undefined),
    invoke_vii: invoke(undefined),
    invoke_viiii: invoke(undefined),
    invoke_i: invoke(0),
    invoke_ii: invoke(0),
    invoke_iii: invoke(0),
    invoke_iiii: invoke(0),
    invoke_iiiii: invoke(0),
    invoke_iiiiii: invoke(0),
    invoke_ji: invoke(0n),

    __syscall_getuid32: () => 0,
    __syscall_geteuid32: () => 0,
    __syscall_getgid32: () => 0,
    __syscall_getegid32: () => 0,

    __syscall_openat: sys((dirfd: number, pathPtr: number, flags: number, varargs: number) => {
      const p = P();
      const path = str(pathPtr);
      const mode = flags & O.CREAT ? dv().getInt32(varargs, true) : 0;
      const dir = base(dirfd, path);
      const r = vfs.resolveParent(dir, path);
      let inode = r.inode;
      if (!inode) {
        if (!(flags & O.CREAT)) fail(E.ENOENT);
        if (r.trailingSlash) fail(E.EISDIR);
        inode = vfs.createFile(r.parent, r.name, mode & ~p.umask & 0o7777);
      } else {
        if (flags & O.CREAT && flags & O.EXCL) fail(E.EEXIST);
        if (inode.isLink()) {
          if (flags & O.NOFOLLOW) fail(E.ELOOP);
          inode = resolveFinal(dir, path, true).inode;
          const shared = inode.fdTarget?.() as OpenFile | undefined;
          if (inode.fdTarget) {
            if (!shared) fail(E.ENOENT);
            shared!.refs++;
            return p.allocFd(shared!, (flags & O.CLOEXEC) !== 0);
          }
        }
      }
      if (inode.isDir() && (flags & O.ACCMODE) !== O.RDONLY) fail(E.EISDIR);
      if (flags & O.TRUNC && inode.isReg() && (flags & O.ACCMODE) !== O.RDONLY) {
        if (inode.generate) fail(E.EACCES);
        vfs.truncate(inode, 0);
      }
      if (inode.generate && (flags & O.ACCMODE) !== O.RDONLY) fail(E.EACCES);
      const f = k.open(inode, flags & ~(O.CREAT | O.EXCL | O.TRUNC | O.CLOEXEC));
      const fd = p.allocFd(f, (flags & O.CLOEXEC) !== 0);
      if (fd < 0) f.release();
      return fd;
    }),
    __syscall_fcntl64: sys((fd: number, cmd: number, varargs: number) => {
      const p = P();
      const e = p.fds[fd];
      if (fd < 0 || !e) return -E.EBADF;
      const arg = dv().getInt32(varargs, true);
      switch (cmd) {
        case F.DUPFD:
        case F.DUPFD_CLOEXEC: {
          const n = p.allocFd(e.file, cmd === F.DUPFD_CLOEXEC, arg);
          if (n >= 0) e.file.refs++;
          return n;
        }
        case F.GETFD:
          return e.cloexec ? 1 : 0;
        case F.SETFD:
          e.cloexec = (arg & 1) !== 0;
          return 0;
        case F.GETFL:
          return e.file.flags;
        case F.SETFL: {
          const m = O.NONBLOCK | O.APPEND;
          e.file.flags = (e.file.flags & ~m) | (arg & m);
          return 0;
        }
        case F.GETLK:
          dv().setInt16(arg, 2, true); // F_UNLCK
          return 0;
        case F.SETLK:
        case F.SETLKW:
          return 0;
      }
      return -E.EINVAL;
    }),
    __syscall_ioctl: sys((fd: number, op: number, varargs: number) => {
      const f = file(fd);
      const argp = dv().getUint32(varargs, true);
      if (op === IOCTL.FIONBIO) {
        if (dv().getInt32(argp, true)) f.flags |= O.NONBLOCK;
        else f.flags &= ~O.NONBLOCK;
        return 0;
      }
      if (op === IOCTL.FIONREAD && f.pipe) {
        dv().setInt32(argp, f.pipe.len, true);
        return 0;
      }
      if (f.kind !== "tty") return -E.ENOTTY;
      return f.tty!.ioctl(op, argp, dv(), P());
    }),
    __syscall_dup: sys((fd: number) => {
      const f = file(fd);
      const n = P().allocFd(f, false);
      if (n >= 0) f.refs++;
      return n;
    }),
    __syscall_dup3: sys((oldfd: number, newfd: number, flags: number) => {
      const p = P();
      const f = file(oldfd);
      if (oldfd === newfd) return -E.EINVAL;
      if (newfd < 0 || newfd >= 256) return -E.EBADF;
      if (p.fds[newfd]) p.closeFd(newfd);
      f.refs++;
      p.fds[newfd] = { file: f, cloexec: (flags & O.CLOEXEC) !== 0 };
      return newfd;
    }),
    __syscall_pipe2: sys((fds: number, flags: number) => {
      const p = P();
      const inode = new Inode(S.IFIFO | 0o600);
      const pipe = new Pipe();
      const r = OpenFile.pipeEnd(vfs, pipe, inode, false, flags & O.NONBLOCK);
      const w = OpenFile.pipeEnd(vfs, pipe, inode, true, flags & O.NONBLOCK);
      const cloexec = (flags & O.CLOEXEC) !== 0;
      const a = p.allocFd(r, cloexec);
      const b = a < 0 ? a : p.allocFd(w, cloexec);
      if (b < 0) {
        if (a >= 0) p.closeFd(a);
        else r.release();
        w.release();
        return -E.EMFILE;
      }
      dv().setInt32(fds, a, true);
      dv().setInt32(fds + 4, b, true);
      return 0;
    }),
    __syscall_poll: (fds: number, nfds: number, timeout: number) => {
      const deadline = timeout > 0 ? Date.now() + timeout : undefined;
      const op = () => {
        const n = pollOnce(fds, nfds);
        if (n || timeout === 0) return n;
        if (deadline !== undefined && Date.now() >= deadline) return 0;
        return BLOCK;
      };
      return k.blocking(img, op, { intr: () => -E.EINTR, deadline: () => deadline, nonblock: () => 0 });
    },
    __syscall_poll_nonblocking: sys((fds: number, nfds: number) => pollOnce(fds, nfds)),

    __syscall_chdir: sys((path: number) => {
      const inode = lookup(AT.FDCWD, str(path));
      if (!inode.isDir()) return -E.ENOTDIR;
      P().cwd = inode;
      return 0;
    }),
    __syscall_getcwd: sys((buf: number, size: number) => {
      const b = enc.encode(vfs.pathOf(P().cwd));
      if (size < b.length + 1) return -E.ERANGE;
      img.u8().set(b, buf);
      img.u8()[buf + b.length] = 0;
      return b.length + 1;
    }),
    __syscall_umask: sys((mask: number) => {
      const p = P();
      const old = p.umask;
      p.umask = mask & 0o777;
      return old;
    }),
    __syscall_fstat64: sys((fd: number, buf: number) => {
      const f = file(fd);
      return writeStat(buf, f.inode, f);
    }),
    __syscall_stat64: sys((path: number, buf: number) => writeStat(buf, lookup(AT.FDCWD, str(path)))),
    __syscall_lstat64: sys((path: number, buf: number) => writeStat(buf, lookup(AT.FDCWD, str(path), false))),
    __syscall_newfstatat: sys((dirfd: number, path: number, buf: number, flags: number) => {
      const s = str(path);
      if (!s && flags & AT.EMPTY_PATH) {
        if (dirfd === AT.FDCWD) return writeStat(buf, P().cwd);
        const f = file(dirfd);
        return writeStat(buf, f.inode, f);
      }
      return writeStat(buf, lookup(dirfd, s, !(flags & AT.SYMLINK_NOFOLLOW)));
    }),
    __syscall_readlinkat: sys((dirfd: number, path: number, buf: number, size: number) => {
      if (size <= 0) return -E.EINVAL;
      const inode = lookup(dirfd, str(path), false);
      if (!inode.isLink()) return -E.EINVAL;
      const b = enc.encode(inode.linkTarget()).subarray(0, size);
      img.u8().set(b, buf);
      return b.length;
    }),
    __syscall_getdents64: sys((fd: number, dirp: number, count: number) => {
      const f = file(fd);
      if (f.kind !== "dir") return -E.ENOTDIR;
      const list = dirents(f);
      const d = dv();
      const m = img.u8();
      let pos = 0;
      while (f.pos < list.length) {
        const ent = list[f.pos];
        const name = enc.encode(ent.name);
        const reclen = (19 + name.length + 1 + 7) & ~7;
        if (pos + reclen > count) {
          if (pos === 0) return -E.EINVAL;
          break;
        }
        const at = dirp + pos;
        d.setBigUint64(at, BigInt(ent.ino), true);
        d.setBigInt64(at + 8, BigInt(f.pos + 1), true);
        d.setUint16(at + 16, reclen, true);
        d.setUint8(at + 18, ent.type);
        m.set(name, at + 19);
        m.fill(0, at + 19 + name.length, at + reclen);
        pos += reclen;
        f.pos++;
      }
      return pos;
    }),
    __syscall_mkdirat: sys((dirfd: number, path: number, mode: number) => {
      const s = str(path);
      const r = vfs.resolveParent(base(dirfd, s), s);
      if (r.inode) return -E.EEXIST;
      vfs.mkdir(r.parent, r.name, mode & ~P().umask & 0o7777);
      return 0;
    }),
    __syscall_unlinkat: sys((dirfd: number, path: number, flags: number) => unlink(dirfd, str(path), flags)),
    __syscall_rmdir: sys((path: number) => unlink(AT.FDCWD, str(path), AT.REMOVEDIR)),
    __syscall_renameat: sys((olddirfd: number, oldp: number, newdirfd: number, newp: number) => {
      const os = str(oldp);
      const ns = str(newp);
      const from = vfs.resolveParent(base(olddirfd, os), os);
      const to = vfs.resolveParent(base(newdirfd, ns), ns);
      const inode = from.inode ?? fail(E.ENOENT);
      if (from.name === "." || from.name === ".." || to.name === "." || to.name === "..") return -E.EBUSY;
      if (!from.parent.children || !to.parent.children) return -E.EACCES;
      if (to.inode === inode) return 0;
      if (inode.isDir()) {
        for (let d: Inode | undefined = to.parent; d; d = d.parent === d ? undefined : d.parent) {
          if (d === inode) return -E.EINVAL;
        }
      }
      if (to.inode) {
        if (inode.isDir() && !to.inode.isDir()) return -E.ENOTDIR;
        if (!inode.isDir() && to.inode.isDir()) return -E.EISDIR;
        if (to.inode.isDir() && vfs.listDir(to.inode).length) return -E.ENOTEMPTY;
        vfs.unlinkEntry(to.parent, to.name);
      }
      from.parent.children.delete(from.name);
      to.parent.children.set(to.name, inode);
      if (inode.isDir()) {
        inode.parent = to.parent;
        from.parent.nlink--;
        to.parent.nlink++;
      }
      from.parent.touch();
      to.parent.touch();
      inode.ctime = Date.now();
      return 0;
    }),
    __syscall_symlinkat: sys((target: number, dirfd: number, path: number) => {
      const s = str(path);
      const r = vfs.resolveParent(base(dirfd, s), s);
      if (r.inode) return -E.EEXIST;
      vfs.symlink(r.parent, r.name, str(target));
      return 0;
    }),
    __syscall_linkat: sys((olddirfd: number, oldp: number, newdirfd: number, newp: number, flags: number) => {
      const inode = lookup(olddirfd, str(oldp), (flags & AT.SYMLINK_FOLLOW) !== 0);
      if (inode.isDir()) return -E.EPERM;
      const s = str(newp);
      const r = vfs.resolveParent(base(newdirfd, s), s);
      if (r.inode) return -E.EEXIST;
      vfs.link(r.parent, r.name, inode);
      inode.nlink++;
      inode.ctime = Date.now();
      return 0;
    }),
    __syscall_mknodat: sys((dirfd: number, path: number, mode: number) => {
      const s = str(path);
      const r = vfs.resolveParent(base(dirfd, s), s);
      if (r.inode) return -E.EEXIST;
      const type = mode & S.IFMT;
      const perm = mode & ~P().umask & 0o7777;
      if (type === S.IFIFO) vfs.link(r.parent, r.name, new Inode(S.IFIFO | perm));
      else if (type === S.IFREG || type === 0) vfs.createFile(r.parent, r.name, perm);
      else return -E.EPERM;
      return 0;
    }),
    __syscall_fchmod: sys((fd: number, mode: number) => {
      const inode = file(fd).inode;
      inode.mode = (inode.mode & S.IFMT) | (mode & 0o7777);
      inode.ctime = Date.now();
      return 0;
    }),
    __syscall_chmod: sys((path: number, mode: number) => {
      const inode = lookup(AT.FDCWD, str(path));
      if (inode.generate || inode.dynamic) return -E.EPERM;
      inode.mode = (inode.mode & S.IFMT) | (mode & 0o7777);
      inode.ctime = Date.now();
      return 0;
    }),
    __syscall_fchownat: sys((dirfd: number, path: number, uid: number, gid: number, flags: number) => {
      const inode = lookup(dirfd, str(path), !(flags & AT.SYMLINK_NOFOLLOW));
      if (uid !== -1) inode.uid = uid >>> 0;
      if (gid !== -1) inode.gid = gid >>> 0;
      inode.ctime = Date.now();
      return 0;
    }),
    __syscall_fchown32: sys((fd: number, uid: number, gid: number) => {
      const inode = file(fd).inode;
      if (uid !== -1) inode.uid = uid >>> 0;
      if (gid !== -1) inode.gid = gid >>> 0;
      return 0;
    }),
    __syscall_ftruncate64: sys((fd: number, len: bigint) => {
      const f = file(fd);
      if (f.kind !== "reg" || f.content) return -E.EINVAL;
      if (!f.writable) return -E.EBADF;
      if (len < 0n) return -E.EINVAL;
      vfs.truncate(f.inode, Number(len));
      return 0;
    }),
    __syscall_statfs64: sys((path: number, _size: number, buf: number) => {
      const inode = lookup(AT.FDCWD, str(path));
      const d = dv();
      const proc = !!(inode.generate || inode.dynamic);
      const bsize = 4096;
      const blocks = proc ? 0 : FS_CAPACITY / bsize;
      const free = proc ? 0 : Math.floor((FS_CAPACITY - vfs.used) / bsize);
      img.u8().fill(0, buf, buf + 88);
      d.setUint32(buf, proc ? 0x9fa0 : 0x01021994, true); // PROC_SUPER_MAGIC / TMPFS_MAGIC
      d.setUint32(buf + 4, bsize, true);
      d.setBigUint64(buf + 8, BigInt(blocks), true);
      d.setBigUint64(buf + 16, BigInt(free), true);
      d.setBigUint64(buf + 24, BigInt(free), true);
      d.setBigUint64(buf + 32, proc ? 0n : 65536n, true);
      d.setBigUint64(buf + 40, proc ? 0n : 60000n, true);
      d.setUint32(buf + 56, 255, true);
      d.setUint32(buf + 60, bsize, true);
      return 0;
    }),
    __syscall_faccessat: sys((dirfd: number, path: number, amode: number, flags: number) => {
      const inode = lookup(dirfd, str(path), !(flags & AT.SYMLINK_NOFOLLOW));
      if (amode & 1 && !inode.isDir() && !inode.exe && !(inode.mode & 0o111)) return -E.EACCES;
      if (amode & 2 && (inode.generate || inode.dynamic)) return -E.EACCES;
      return 0;
    }),
    __syscall_utimensat: sys((dirfd: number, path: number, times: number, flags: number) => {
      const inode = path ? lookup(dirfd, str(path), !(flags & AT.SYMLINK_NOFOLLOW)) : file(dirfd).inode;
      setTimes(inode, times);
      return 0;
    }),
    __syscall_fdatasync: sys((fd: number) => (file(fd), 0)),
  };

  const wasiImports: Record<string, unknown> = {
    proc_exit: (code: number) => k.exit(img, code, false),
    fd_read,
    fd_write,
    fd_close: wasi((fd: number) => -P().closeFd(fd)),
    fd_sync: wasi((fd: number) => (file(fd), 0)),
    fd_seek: wasi((fd: number, offset: bigint, whence: number, out: number) => {
      const r = file(fd).seek(Number(offset), whence);
      if (r < 0) return -r;
      dv().setBigInt64(out, BigInt(r), true);
      return 0;
    }),
    fd_fdstat_get: wasi((fd: number, buf: number) => {
      const f = file(fd);
      const d = dv();
      const type =
        f.kind === "tty" ? FILETYPE.CHAR : f.kind === "dir" ? FILETYPE.DIR : f.kind === "pipe" ? FILETYPE.UNKNOWN : FILETYPE.REG;
      d.setUint8(buf, type);
      d.setUint16(buf + 2, (f.flags & O.APPEND ? 1 : 0) | (f.flags & O.NONBLOCK ? 4 : 0), true);
      d.setBigUint64(buf + 8, 0xffffffffffffffffn, true);
      d.setBigUint64(buf + 16, 0xffffffffffffffffn, true);
      return 0;
    }),
    environ_sizes_get: (count: number, size: number) => {
      const e = P().env;
      dv().setUint32(count, e.length, true);
      dv().setUint32(size, e.reduce((n, s) => n + s.length + 1, 0), true);
      return 0;
    },
    environ_get: (environ: number, buf: number) => {
      const d = dv();
      P().env.forEach((s, i) => {
        d.setUint32(environ + i * 4, buf, true);
        const b = binToBytes(s);
        img.u8().set(b, buf);
        img.u8()[buf + b.length] = 0;
        buf += b.length + 1;
      });
      return 0;
    },
    clock_time_get: (id: number, _precision: bigint, out: number) => {
      if (id < 0 || id > 3) return E.EINVAL;
      const ms = id === 0 ? Date.now() : performance.now();
      dv().setBigUint64(out, BigInt(Math.round(ms * 1e6)), true);
      return 0;
    },
  };

  const bbw: Record<string, unknown> = {
    vfork: () => {
      if (img.rewinding) return k.finish(img, img.finishRewind() as number, true);
      return k.vfork(img);
    },
    execve: sys((path: number, argv: number, envp: number) =>
      k.execve(img, str(path), img.strArray(argv), img.strArray(envp)),
    ),
    wait4: (pid: number, status: number, options: number, ru: number) => {
      const p = P();
      const op = () =>
        k.wait4(p, pid, options, (_pid, st, c) => {
          if (status) dv().setInt32(status, st, true);
          if (ru) {
            img.u8().fill(0, ru, ru + 152);
            const ms = c.cpuMs + c.childCpuMs;
            dv().setBigInt64(ru, BigInt(Math.floor(ms / 1000)), true);
            dv().setInt32(ru + 8, Math.floor((ms % 1000) * 1000), true);
          }
        });
      return k.blocking(img, op, { intr: () => -E.EINTR, restart: true, nonblock: () => 0 });
    },
    nanosleep: (ns: bigint, rem: number) => {
      const p = P();
      if (!img.rewinding) p.sleepEnd = Date.now() + Number(ns) / 1e6;
      return k.blocking(img, () => (Date.now() >= p.sleepEnd ? 0 : BLOCK), {
        intr: () => {
          const left = Math.max(0, p.sleepEnd - Date.now());
          if (rem) dv().setBigInt64(rem, BigInt(Math.round(left * 1e6)), true);
          return -E.EINTR;
        },
        deadline: () => p.sleepEnd,
        nonblock: () => 0,
      });
    },
    sigsuspend: (mask: bigint) => {
      if (!img.rewinding) P().mask = K.maskable(mask);
      return k.blocking(img, () => BLOCK, { intr: () => -E.EINTR, nonblock: () => -E.EINTR });
    },
    yield: () => {
      if (img.rewinding) img.finishRewind();
      k.finish(img, 0, true);
    },
    getpid: () => P().pid,
    getppid: () => P().ppid,
    getpgid: sys((pid: number) => {
      const t = pid ? k.procs.get(pid) : P();
      return t ? t.pgid : -E.ESRCH;
    }),
    setpgid: sys((pid: number, pgid: number) => {
      const p = P();
      const t = pid ? k.procs.get(pid) : p;
      if (!t || (t !== p && t.ppid !== p.pid)) return -E.ESRCH;
      if (pgid < 0) return -E.EINVAL;
      if (t.sid !== p.sid || t.pid === t.sid) return -E.EPERM;
      const g = pgid || t.pid;
      if (g !== t.pid && ![...k.procs.values()].some((q) => q.pgid === g && q.sid === p.sid)) return -E.EPERM;
      t.pgid = g;
      return 0;
    }),
    getsid: sys((pid: number) => {
      const t = pid ? k.procs.get(pid) : P();
      return t ? t.sid : -E.ESRCH;
    }),
    setsid: sys(() => {
      const p = P();
      if ([...k.procs.values()].some((q) => q.pgid === p.pid && q !== p) || p.pgid === p.pid) return -E.EPERM;
      p.sid = p.pgid = p.pid;
      return p.pid;
    }),
    kill: sys((pid: number, sig: number) => {
      if (sig < 0 || sig > 64) return -E.EINVAL;
      return k.kill(P(), pid, sig);
    }),
    sigdisp: (sig: number, disp: number) => {
      const p = P();
      if (sig < 1 || sig > 64) return;
      p.disp[sig] = disp;
      if (p.discards(sig)) p.pending &= ~sigbit(sig);
      k.finish(img, 0, false);
    },
    sigmask: (mask: bigint) => {
      P().mask = K.maskable(mask);
      k.finish(img, 0, false);
    },
    sysinfo: sys((buf: number) => {
      const d = dv();
      img.u8().fill(0, buf, buf + 64);
      const mem = memoryUse(k);
      d.setInt32(buf, Math.floor(k.uptime()), true);
      k.load.forEach((l, i) => d.setUint32(buf + 4 + i * 4, Math.round(l * 65536), true));
      d.setUint32(buf + 16, MEM_TOTAL, true);
      d.setUint32(buf + 20, MEM_TOTAL - mem.used, true);
      d.setUint32(buf + 24, mem.fs, true);
      d.setUint16(buf + 40, k.procs.size, true);
      d.setUint32(buf + 52, 1, true);
      return 0;
    }),
    uname: sys((buf: number) => {
      const f = [UTS.sysname, k.hostname, UTS.release, UTS.version, UTS.machine, "(none)"];
      f.forEach((s, i) => {
        img.u8().fill(0, buf + i * 65, buf + i * 65 + 65);
        img.writeStr(buf + i * 65, s, 65);
      });
      return 0;
    }),
    sethostname: sys((name: number, len: number) => {
      if (len > 64) return -E.EINVAL;
      k.hostname = img.str(name, len);
      return 0;
    }),
    times: (buf: number) => {
      const p = P();
      const ticks = (ms: number) => Math.floor(ms / 10); // sysconf(_SC_CLK_TCK) is 100
      if (buf) {
        const d = dv();
        d.setInt32(buf, ticks(p.cpuMs), true);
        d.setInt32(buf + 4, 0, true);
        d.setInt32(buf + 8, ticks(p.childCpuMs), true);
        d.setInt32(buf + 12, 0, true);
      }
      return ticks(k.uptime() * 1000) | 0;
    },
    alarm: (sec: number) => {
      const p = P();
      const now = Date.now();
      const old = p.alarmAt ? Math.max(1, Math.ceil((p.alarmAt - now) / 1000)) : 0;
      p.alarmAt = sec ? now + sec * 1000 : 0;
      k.wake();
      return old;
    },
  };

  return { env, wasi_snapshot_preview1: wasiImports, bbw } as WebAssembly.Imports;
}

/**
 * Resolves a host name from /etc/hosts (there is no DNS). Returns the IPv4
 * address in network byte order, or 0 (0.0.0.0) if the name is unknown:
 * Emscripten's getaddrinfo can't report failure for this import.
 */
function lookupHost(k: Kernel, name: string): number {
  let hosts = "";
  try {
    const inode = k.vfs.resolve(k.vfs.root, "/etc/hosts").inode;
    hosts = new TextDecoder().decode(inode.data.subarray(0, inode.size));
  } catch {
    // no /etc/hosts
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(name)) hosts += `\n${name} ${name}`;
  for (const line of hosts.split("\n")) {
    const [addr, ...names] = line.replace(/#.*/, "").trim().split(/\s+/);
    if (!names.includes(name)) continue;
    const parts = addr.split(".").map(Number);
    if (parts.length !== 4 || parts.some((x) => !(x >= 0 && x <= 255))) continue;
    return (parts[0] | (parts[1] << 8) | (parts[2] << 16) | (parts[3] << 24)) >>> 0;
  }
  return 0;
}

/** Memory in use: every live wasm instance plus file contents. */
export function memoryUse(k: Kernel) {
  let wasm = 0;
  for (const p of k.procs.values()) if (p.image) wasm += p.image.exports.memory.buffer.byteLength;
  return { wasm, fs: k.vfs.used, used: wasm + k.vfs.used };
}

export { DISP };
