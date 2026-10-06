// /proc and /dev. /proc files are generated when opened, in the formats
// BusyBox's libbb/procps.c, top, free, df and uptime parse.
import { S } from "./constants.ts";
import type { OpenFile } from "./files.ts";
import type { Kernel } from "./kernel.ts";
import type { Process } from "./process.ts";
import { MEM_TOTAL, UTS, memoryUse } from "./syscalls.ts";
import { Inode, type DynamicDir } from "./vfs.ts";

const HZ = 100;
const TTY1 = (4 << 8) | 1;

const file = (gen: () => string | Uint8Array, mode = 0o444) => {
  const f = new Inode(S.IFREG | mode);
  f.generate = gen;
  return f;
};
const link = (target: () => string) => {
  const l = new Inode(S.IFLNK | 0o777);
  l.readTarget = target;
  return l;
};
const dir = (d: DynamicDir, parent: Inode) => {
  const i = new Inode(S.IFDIR | 0o555);
  i.dynamic = d;
  i.parent = parent;
  i.nlink = 2;
  return i;
};

/** A dynamic directory with a fixed set of entries, built once. */
function staticDir(parent: Inode, entries: Record<string, (self: Inode) => Inode>): Inode {
  const made = new Map<string, Inode>();
  const self: Inode = dir(
    {
      list: () => Object.keys(entries),
      lookup: (name) => {
        if (!entries[name]) return undefined;
        let i = made.get(name);
        if (!i) {
          i = entries[name](self);
          if (i.isDir()) i.parent = self;
          made.set(name, i);
        }
        return i;
      },
    },
    parent,
  );
  return self;
}

const ticks = (ms: number) => Math.floor((ms / 1000) * HZ);
const kb = (bytes: number) => Math.floor(bytes / 1024);

const STATE: Record<string, string> = { runnable: "R", blocked: "S", stopped: "T", zombie: "Z", vfork: "D" };

export function mountProc(k: Kernel) {
  const vfs = k.vfs;
  const procDir = vfs.mkdirp("/proc");
  const actor = (): Process | undefined => k.running?.image?.current ?? k.running;

  const memOf = (p: Process) => p.image?.exports.memory.buffer.byteLength ?? 0;

  const pidDirs = new Map<number, Inode>();
  const pidDir = (p: Process, parent: Inode): Inode => {
    const cached = pidDirs.get(p.pid);
    if (cached) return cached;
    const fdDir = (self: Inode) =>
      dir(
        {
          list: () => p.fds.flatMap((e, i) => (e ? [String(i)] : [])),
          lookup: (name) => {
            const n = Number(name);
            const e = /^\d+$/.test(name) ? p.fds[n] : undefined;
            if (!e) return undefined;
            const l = link(() => describe(p.fds[n]?.file ?? e.file));
            l.fdTarget = () => p.fds[n]?.file;
            return l;
          },
        },
        self,
      );
    const describe = (f: OpenFile) => {
      if (f.kind === "pipe") return pathOfFile(f.inode) ?? `pipe:[${f.inode.ino}]`;
      if (f.kind === "tty") return "/dev/tty1";
      if (f.inode.isDir()) return vfs.pathOf(f.inode);
      return pathOfFile(f.inode) ?? `/(deleted)`;
    };
    const d = staticDir(parent, {
      stat: () => file(() => statLine(p)),
      statm: () =>
        file(() => {
          const pages = Math.ceil(memOf(p) / 4096);
          return `${pages} ${pages} 0 ${Math.ceil(934 / 4)} 0 ${pages} 0\n`;
        }),
      status: () =>
        file(() => {
          const m = kb(memOf(p));
          return (
            `Name:\t${p.comm}\nUmask:\t${p.umask.toString(8).padStart(4, "0")}\nState:\t${STATE[p.state]} (${p.state === "blocked" ? "sleeping" : p.state})\n` +
            `Tgid:\t${p.pid}\nPid:\t${p.pid}\nPPid:\t${p.ppid}\nUid:\t0\t0\t0\t0\nGid:\t0\t0\t0\t0\n` +
            `VmSize:\t${m} kB\nVmRSS:\t${m} kB\nThreads:\t1\n` +
            `SigPnd:\t${hex(p.pending)}\nSigBlk:\t${hex(p.mask)}\n`
          );
        }),
      cmdline: () => file(() => (p.state === "zombie" ? "" : p.argv.join("\0") + "\0")),
      comm: () => file(() => p.comm + "\n"),
      environ: () => file(() => p.env.join("\0") + (p.env.length ? "\0" : "")),
      cwd: () => link(() => vfs.pathOf(p.cwd)),
      exe: () => link(() => "/bin/busybox"),
      root: () => link(() => "/"),
      fd: fdDir,
    });
    pidDirs.set(p.pid, d);
    return d;
  };

  const pathOfFile = (inode: Inode): string | undefined => {
    // Regular files don't know their names; search the tree (small).
    const seen = new Set<Inode>();
    const walk = (d: Inode, prefix: string): string | undefined => {
      if (seen.has(d) || !d.children) return undefined;
      seen.add(d);
      for (const [n, c] of d.children) {
        if (c === inode) return prefix + "/" + n;
        if (c.isDir()) {
          const r = walk(c, prefix + "/" + n);
          if (r) return r;
        }
      }
      return undefined;
    };
    return walk(vfs.root, "");
  };

  const statLine = (p: Process) => {
    const tty = p.sid === k.tty.sid && k.tty.sid ? TTY1 : 0;
    const tpgid = tty ? k.tty.fgPgrp : -1;
    const mem = memOf(p);
    const start = ticks(p.startTime - (performance.now() - k.uptime() * 1000));
    return (
      `${p.pid} (${p.comm}) ${STATE[p.state]} ${p.ppid} ${p.pgid} ${p.sid} ${tty} ${tpgid} 4194560 0 0 0 0 ` +
      `${ticks(p.cpuMs)} 0 ${ticks(p.childCpuMs)} 0 20 0 1 0 ${start} ${mem} ${Math.ceil(mem / 4096)} ` +
      `18446744073709551615 0 0 0 0 0 0 0 0 0 0 0 0 17 0 0 0 0 0\n`
    );
  };

  const cpuLine = () => {
    let busy = 0;
    for (const p of k.procs.values()) busy += p.cpuMs + p.childCpuMs;
    const total = ticks(k.uptime() * 1000);
    const user = Math.min(total, ticks(busy));
    return `${user} 0 0 ${total - user} 0 0 0 0 0 0`;
  };

  const procs = staticDir(procDir.parent!, {
    self: () => link(() => String(actor()?.pid ?? 1)),
    "thread-self": () => link(() => `${actor()?.pid ?? 1}/task/${actor()?.pid ?? 1}`),
    uptime: () =>
      file(() => {
        const up = k.uptime();
        let busy = 0;
        for (const p of k.procs.values()) busy += p.cpuMs;
        return `${up.toFixed(2)} ${Math.max(0, up - busy / 1000).toFixed(2)}\n`;
      }),
    loadavg: () =>
      file(() => {
        let running = 0;
        for (const p of k.procs.values()) if (p.state === "runnable" || p.state === "vfork") running++;
        const pids = [...k.procs.keys()];
        return `${k.load.map((l) => l.toFixed(2)).join(" ")} ${Math.max(1, running)}/${k.procs.size} ${Math.max(...pids)}\n`;
      }),
    stat: () =>
      file(() => {
        const cpu = cpuLine();
        return (
          `cpu  ${cpu}\ncpu0 ${cpu}\nintr 0\nctxt 0\nbtime ${Math.floor(k.bootTime / 1000)}\n` +
          `processes ${k.procs.size}\nprocs_running 1\nprocs_blocked 0\n`
        );
      }),
    meminfo: () =>
      file(() => {
        const m = memoryUse(k);
        const total = kb(MEM_TOTAL);
        const free = kb(MEM_TOTAL - m.used);
        return (
          `MemTotal:       ${total} kB\nMemFree:        ${free} kB\nMemAvailable:   ${free} kB\n` +
          `Buffers:        0 kB\nCached:         ${kb(m.fs)} kB\nSwapCached:     0 kB\n` +
          `Shmem:          ${kb(m.fs)} kB\nSwapTotal:      0 kB\nSwapFree:       0 kB\n`
        );
      }),
    version: () => file(() => `${UTS.sysname} version ${UTS.release} (root@linuxfest) (emcc, wasm-ld) ${UTS.version}\n`),
    cpuinfo: () =>
      file(
        () =>
          `processor\t: 0\nvendor_id\t: WebAssembly\nmodel name\t: ${cpuName()}\n` +
          `cpu MHz\t\t: 1000.000\ncache size\t: 0 KB\nflags\t\t: wasm32 simd128 bulk-memory\nbogomips\t: 2000.00\n\n`,
      ),
    mounts: () =>
      file(
        () =>
          "/dev/root / tmpfs rw,relatime 0 0\nproc /proc proc rw,nosuid,nodev,noexec 0 0\n" +
          "devtmpfs /dev devtmpfs rw,nosuid 0 0\n",
      ),
    filesystems: () => file(() => "nodev\ttmpfs\nnodev\tproc\nnodev\tdevtmpfs\n"),
    cmdline: () => file(() => "console=tty1 root=/dev/root rw\n"),
    hostname: () => file(() => k.hostname + "\n"),
  });

  // /proc itself: the fixed entries plus one directory per process.
  const fixed = procs.dynamic!;
  procDir.children = undefined;
  procDir.dynamic = {
    list: () => [...fixed.list(), ...[...k.procs.keys()].map(String)],
    lookup: (name) => {
      if (/^\d+$/.test(name)) {
        const p = k.procs.get(Number(name));
        if (!p) {
          pidDirs.delete(Number(name));
          return undefined;
        }
        return pidDir(p, procDir);
      }
      return fixed.lookup(name);
    },
  };
  // Stale pid directories are dropped when listed.
  const list = procDir.dynamic.list;
  procDir.dynamic.list = () => {
    for (const pid of pidDirs.keys()) if (!k.procs.has(pid)) pidDirs.delete(pid);
    return list();
  };
}

const hex = (v: bigint) => v.toString(16).padStart(16, "0");

function cpuName() {
  const n = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 1;
  return `WebAssembly virtual CPU (host has ${n} threads)`;
}

export function mountDev(k: Kernel) {
  const vfs = k.vfs;
  vfs.addDevice("/dev/null", "null", (1 << 8) | 3);
  vfs.addDevice("/dev/zero", "zero", (1 << 8) | 5);
  vfs.addDevice("/dev/full", "full", (1 << 8) | 7);
  vfs.addDevice("/dev/random", "random", (1 << 8) | 8);
  vfs.addDevice("/dev/urandom", "random", (1 << 8) | 9);
  vfs.addDevice("/dev/tty", "tty", 5 << 8);
  vfs.addDevice("/dev/console", "tty", (5 << 8) | 1, 0o600);
  vfs.addDevice("/dev/tty1", "tty", TTY1, 0o620);
  vfs.addSymlink("/dev/stdin", "/proc/self/fd/0");
  vfs.addSymlink("/dev/stdout", "/proc/self/fd/1");
  vfs.addSymlink("/dev/stderr", "/proc/self/fd/2");
  vfs.addSymlink("/dev/fd", "/proc/self/fd");
  vfs.mkdirp("/dev/shm", 0o1777);
}
