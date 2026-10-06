// Assembles a running system: root filesystem, /dev, /proc, kernel, login shell.
import { Kernel, type KernelHost, type KernelOptions } from "./kernel/kernel.ts";
import { mountDev, mountProc } from "./kernel/procfs.ts";
import { Vfs } from "./kernel/vfs.ts";
import { buildRoot } from "./rootfs.ts";

export interface SystemOptions extends KernelOptions {
  module: WebAssembly.Module;
  host: KernelHost;
  rows?: number;
  cols?: number;
  /** Extra files, path → contents (e.g. festival data fetched at boot). */
  files?: Record<string, string | Uint8Array>;
}

export const DEFAULT_ENV = [
  "HOME=/root",
  "PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
  "TERM=xterm-256color",
  "USER=root",
  "LOGNAME=root",
  "SHELL=/bin/sh",
  "LANG=C.UTF-8",
];

export function createSystem(o: SystemOptions): Kernel {
  const vfs = new Vfs();
  buildRoot(vfs);
  for (const [path, data] of Object.entries(o.files ?? {})) vfs.writeFile(path, data);
  const k = new Kernel(o.module, vfs, o.host, { env: DEFAULT_ENV, ...o });
  mountDev(k);
  mountProc(k);
  if (o.rows && o.cols) {
    k.tty.rows = o.rows;
    k.tty.cols = o.cols;
  }
  k.boot();
  return k;
}
