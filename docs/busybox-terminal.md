# Browser terminal: BusyBox in WebAssembly

The `$ whoami` card in the home page hero opens a real Linux shell: BusyBox 1.37
(the hush shell and about 136 applets) compiled to WebAssembly, running under a
small Linux-like kernel written in TypeScript, displayed with xterm.js.

It is not an emulator and not a scripted fake. `ls | wc -l` starts two BusyBox
processes connected by a pipe; job control, signals, `/proc`, `vi`, `top` and
`tar` all work. Everything runs in the visitor's browser: there is no network
access and no server-side component.

It can also be opened with `Ctrl+Alt+T` anywhere on the home page.

## Design constraints

- **No cross-origin isolation.** COOP/COEP headers would break the Goftino chat
  widget and Google Analytics, so `SharedArrayBuffer` and `Atomics.wait` are
  unavailable. Blocking is implemented with Asyncify instead (see below).
- **No cost to the home page.** Nothing terminal-related is requested until the
  launcher is hovered (prefetch) or opened. The main bundle is unchanged.
- **No cost while idle.** A process waiting for input is suspended; there are no
  polling loops or timers while nothing runs.
- **Failures stay inside the terminal.** Everything runs in a Web Worker. If a
  process stops responding, the page terminates the worker and boots a new one.

## Architecture

```
main thread                              Web Worker
┌─────────────────────────┐ postMessage ┌───────────────────────────────────────┐
│ LinuxTerminal.tsx       │ ──input───▶ │ Kernel                                │
│  xterm.js + fit addon   │ ◀─output─── │  ├─ Vfs: in-memory filesystem, /proc  │
│  hero launcher          │ ──resize──▶ │  ├─ Tty: line discipline              │
│  ^C watchdog            │ ◀─ack/ping─ │  ├─ process table, scheduler, signals │
└─────────────────────────┘             │  └─ one WebAssembly.Instance per      │
                                        │     process, all of one Module        │
                                        └───────────────────────────────────────┘
```

- `busybox.wasm` is compiled once. Each process is a separate
  `WebAssembly.Instance` with its own memory (4 MB initial, growable to 256 MB).
- All processes run cooperatively on the worker thread.
- Emscripten's generated JavaScript glue is not used. The kernel implements
  every import of `busybox.wasm` itself, so all processes share one filesystem
  and one file-descriptor model.

### Source layout

| Path | Contents |
|---|---|
| `src/linux/kernel/image.ts` | One process image: wasm instance, Asyncify suspend/resume, vfork stack snapshot |
| `src/linux/kernel/kernel.ts` | Process table, scheduler, signal delivery, job control, exit/wait, vfork, exec, init |
| `src/linux/kernel/process.ts` | Process state, descriptor table, wait status encoding |
| `src/linux/kernel/syscalls.ts` | Every `env.*`, `wasi_snapshot_preview1.*` and `bbw.*` import |
| `src/linux/kernel/time.ts` | Local time imports and `strptime` |
| `src/linux/kernel/vfs.ts` | In-memory filesystem: inodes, hard links, symlinks, devices, generated files |
| `src/linux/kernel/files.ts` | Open files, pipes and FIFOs |
| `src/linux/kernel/tty.ts` | Terminal line discipline (canonical and raw modes, echo, signal keys, window size) |
| `src/linux/kernel/procfs.ts` | `/proc` and `/dev` |
| `src/linux/kernel/constants.ts` | ABI constants (errno, flags, signals, ioctls, termios) |
| `src/linux/system.ts` | Assembles filesystem, kernel and login shell; used by the worker and the tests |
| `src/linux/rootfs.ts`, `content.ts`, `applets.ts` | Root filesystem: applet links, `/etc`, `/root`, helper scripts |
| `src/linux/worker.ts` | Worker entry point, output batching, flow control |
| `src/linux/client.ts`, `load.ts`, `terminal.css` | xterm.js setup, worker glue, watchdog; loaded on demand |
| `src/linux/busybox.wasm` | The compiled BusyBox binary (built from `tools/busybox-wasm/`) |
| `src/components/Home/components/LinuxTerminal.tsx` | The terminal window |
| `tools/busybox-wasm/` | Build script, BusyBox config, patch and C shim |
| `tests/linux.test.mjs` | Headless test harness and test cases |

## How it works

### Blocking with Asyncify

A Unix program calls `read()` and expects to wait until input arrives; a
JavaScript function cannot pause. `busybox.wasm` is built with Emscripten's
Asyncify transform, which lets a wasm call stack be saved to a buffer
("unwound") and later restored ("rewound").

When a process calls a blocking import (`read`, `write`, `poll`, `wait4`,
`nanosleep`, `sigsuspend`) and the operation is not ready:

1. The kernel records what the process waits for and unwinds its stack. Control
   returns to the scheduler.
2. When something changes (input, pipe data, a child exiting, a timer), the
   scheduler re-checks waiting processes.
3. A ready process is rewound by calling its `main` again. The blocking import
   is reached with the same arguments, sees that it is rewinding, and returns
   the stored result.

Only imports listed in `-sASYNCIFY_IMPORTS` (in `build.sh`) may suspend:
`bbw.yield`, `bbw.vfork`, `bbw.wait4`, `bbw.nanosleep`, `bbw.sigsuspend`,
`fd_read`, `fd_write`, `__syscall_poll` and `invoke_*`. A new blocking syscall
must be added there and the binary rebuilt.

Imports that cannot suspend (in a vfork child, inside a signal handler, or
while a process is flushing output on exit) never block: writes are forced
through and reads return `EAGAIN`.

### Processes: vfork and exec

Real `fork()` would require copying a wasm instance together with its call
stack, which WebAssembly does not allow. BusyBox is therefore built in NOMMU
mode (`CONFIG_NOMMU`), where it only ever uses:

```c
pid = vfork();
if (pid == 0) { /* dup2, close, ... */ execve(...); _exit(127); }
```

hush also re-executes itself through `/proc/self/exe` for subshells.

- **vfork**: the parent's stack is unwound and the Asyncify buffer is
  snapshotted. The stack is rewound first as the child (`vfork` returns 0); the
  child runs in the parent's memory, as with a real vfork. When the child calls
  `execve` or `_exit`, the snapshot is restored and the stack is rewound again
  as the parent (`vfork` returns the child's pid).
- **execve**: creates a new instance for the same pid. It handles the BusyBox
  binary and its applet links, `/proc/self/exe`, `#!` scripts, and executable
  files without `#!` (run with `/bin/sh`). Descriptors marked close-on-exec are
  closed, handled signals are reset to their defaults, and ignored signals and
  the blocked mask are kept.

### Scheduling

- A process runs until it blocks, exits, or uses up a 10 ms time slice at a
  yield point. Yield points are `fd_write`, `poll`, and a call added to hush's
  command loop (`patches/hush-yield.patch`). This keeps `yes > /dev/null` and
  `while :; do :; done` interruptible with `^C`.
- Between steps the scheduler returns to the worker's event loop (through a
  `MessageChannel`), so input is handled promptly.
- One timer covers the earliest deadline (sleep, poll timeout, alarm, terminal
  read timeout). Nothing is scheduled while every process is waiting.
- Per-process CPU time is measured and reported through `/proc` and `wait4`.
- The process limit is 64. A fork bomb gets `EAGAIN` from `vfork` and the shell
  stays usable; the window's restart button reboots the system.

### Signals and job control

Linux semantics: pending and blocked masks, default actions (terminate, ignore,
stop, continue), handlers, and `SIGKILL`/`SIGSTOP` that cannot be caught or
blocked.

- Handlers are wasm function pointers, so dispositions and the mask live in C.
  The shim reports every change to the kernel (`bbw.sigdisp`, `bbw.sigmask`),
  and the kernel runs a handler by calling the exported `bbw_deliver(sig)`.
- Signals are delivered at the end of each import. A blocked process woken by a
  signal returns `EINTR`; `read`, `write` and `wait4` are restarted instead when
  every handler that ran had `SA_RESTART`, as on Linux.
- `^C`, `^Z` and `^\` in the terminal signal the foreground process group.
  Background readers get `SIGTTIN`. Stops and continues are reported through
  `wait4` (`WUNTRACED`, `WCONTINUED`), so `fg`, `bg` and `jobs` work.
- pid 1 is a kernel-side init: it reaps orphans and starts a new login shell
  when the current one exits.

### Filesystem, terminal and /proc

- **Filesystem**: in memory, with a 64 MB limit on file contents. It resets
  when the page is closed.
- **Pipes** have a 64 KB buffer. Writing to a pipe with no readers raises
  `SIGPIPE`. `open()` on a named FIFO cannot block (it is not an Asyncify
  import), so an end opened before its peer waits in its first `read` or
  `write` instead.
- **Terminal**: canonical line editing, echo, signal characters, raw mode with
  `VMIN`/`VTIME` for `vi` and `top`, output post-processing, and `SIGWINCH` on
  resize.
- **`/proc`**: per-process `stat`, `statm`, `status`, `cmdline`, `comm`,
  `environ`, `cwd`, `exe`, `fd/`, and system-wide `meminfo`, `stat`, `uptime`,
  `loadavg`, `mounts`, `cpuinfo`, `version`. Field formats match what BusyBox's
  `ps`, `top`, `free`, `df` and `uptime` parse. Memory figures are the real
  sizes of the running wasm instances and file contents.
- **`/dev`**: `null`, `zero`, `full`, `random`, `urandom`, `tty`, `tty1`,
  `console`, and `stdin`/`stdout`/`stderr` links to `/proc/self/fd/*`.

### Worker and page

- Output is batched and transferred to the page. When more than 64 KB is
  waiting to be drawn, terminal writes block until xterm.js catches up, so a
  fast writer cannot exhaust memory.
- A process looping with no yield point (`awk 'BEGIN { while (1); }'`) keeps
  the worker busy, so `^C` cannot reach it. After `^C` the page pings the
  worker; with no reply within 2 seconds it terminates the worker and boots a
  new one.
- The window stays mounted after the first open, so closing and reopening it
  keeps the session.
- The site's global stylesheet forces the Vazirmatn font on every element;
  `terminal.css` overrides it for the terminal. The Goftino chat button is
  hidden while the terminal is open, because it covers the terminal on mobile.
- Touch devices get a key bar (Esc, Tab, `^C`, `^D`, arrows). Narrow screens get
  a compact welcome message (`/etc/motd.small`).

## Customizing the content

`src/linux/content.ts` holds the text the visitor sees: `/etc/motd`,
`/etc/profile`, `/root/README`, the fortunes list, and the helper commands in
`/usr/local/bin` (`neofetch`, `fortune`, `cowsay`, `sl`, `sudo`, and stubs for
package managers and network tools, which explain that there is no network).
These are ordinary shell scripts run by hush. Update the festival edition and
wording there.

Notes for editing `/etc/profile`:

- hush has no `alias`; define shell functions instead (`ll() { ls -alF "$@"; }`).
- The login shell is started as `sh -l`, not with argv[0] `-sh`. hush re-executes
  itself with its own argv[0] for subshells, so `-sh` would make every subshell
  read `/etc/profile` again.

Text stays in English: xterm.js does not shape or reorder right-to-left text.

## Building busybox.wasm

`src/linux/busybox.wasm` is committed, so building the site does not need
Emscripten. Rebuild it only when changing the BusyBox version, configuration,
patch or shim.

Requirements: the [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html)
(the committed binary was built with emsdk 6.0.11), `gcc` (for BusyBox's
configuration tools), `python3`, `curl`.

```sh
git clone https://github.com/emscripten-core/emsdk && cd emsdk
./emsdk install 6.0.11 && ./emsdk activate 6.0.11 && source ./emsdk_env.sh
cd /path/to/this/repo
tools/busybox-wasm/build.sh            # → tools/busybox-wasm/out/busybox.wasm
cp tools/busybox-wasm/out/busybox.wasm src/linux/busybox.wasm
pnpm test:linux
```

What `build.sh` does:

- Downloads BusyBox 1.37.0, applies `patches/*.patch`, and generates the
  configuration from `cfg/fragment.config` (`cfg/apply.py` merges it into
  `allnoconfig`; several `oldconfig` passes let dependent options appear).
- Compiles with `emcc`. BusyBox's own link step cannot drive `wasm-ld`, so the
  script links the built archives itself.
- `-D__linux__=1` makes BusyBox take its Linux code paths;
  `shim/include/sys/prctl.h` stubs a missing header. `FEATURE_VI_REGEX_SEARCH`
  is off because musl has no GNU regex.
- Builds with `-g3` so import and export names stay readable (the kernel binds
  by name), then strips the debug info with `wasm-opt`.
- `KEEP_GLUE=1` keeps Emscripten's `busybox.js`, the reference implementation
  of each `env.*` import (argument order, varargs, BigInt for i64), when
  updating `syscalls.ts`.

After a rebuild:

- If the applet set changed, regenerate `src/linux/applets.ts` from the output
  of `busybox --list`.
- The kernel throws at startup if the binary needs an import it does not
  implement. A different Emscripten version can rename or change imports; check
  them with `WebAssembly.Module.imports(new WebAssembly.Module(bytes))`.
- Running `wasm-opt -Oz` on the finished binary was measured to make the gzip
  size larger (345 KB instead of 340 KB), so the build does not do it.

### The C shim (`tools/busybox-wasm/shim/bbwasm.c`)

Emscripten's libc assumes a single process: `getpid()` returns 42, `wait4` is
not implemented, signals stay inside the module and `nanosleep` busy-waits. The
shim replaces those weak definitions with calls to imports in the `bbw` module:

| Import | Purpose |
|---|---|
| `vfork()` | Returns twice (0 in the child, the child's pid in the parent). Blocking. |
| `execve(path, argv, envp)` | Replaces the process image |
| `wait4(pid, status*, options, rusage*)` | Blocking |
| `nanosleep(ns: i64, rem*: i64)` | Blocking; returns 0 or `-EINTR` |
| `sigsuspend(mask: i64)` | Blocking |
| `yield()` | Called from hush's command loop: time-slice check and signal delivery |
| `getpid`, `getppid`, `getpgid`, `setpgid`, `getsid`, `setsid` | Process ids |
| `kill(pid, sig)` | Negative pid targets a process group |
| `sigdisp(sig, disp)` | 0 default, 1 ignore, 2 handler, 3 handler with `SA_RESTART` |
| `sigmask(mask: i64)` | The blocked mask; newly unblocked signals are delivered |
| `sysinfo(struct*)`, `sethostname(name, len)` | |
| `uname(struct utsname*)` | Replaces Emscripten's `uname`, which reports "Emscripten" |
| `alarm(sec)` | |

Exports used by the kernel:

| Export | Purpose |
|---|---|
| `bbw_deliver(sig)` | Runs a handler, applying `sa_mask`, `SA_NODEFER` and `SA_RESETHAND` |
| `bbw_sigsave()`, `bbw_sigrestore()` | A vfork child shares its parent's memory, so a `sigaction()` in the child would overwrite the parent's handlers. The kernel saves this state when vfork starts and restores it before the parent resumes. |
| `bbw_setup(mask, ignored)` | Called before `main`: the blocked mask and ignored signals survive `execve` |

## ABI reference (wasm32, Emscripten musl)

**errno values use WASI numbering**, not Linux numbering (see `constants.ts`):
`ENOENT` 44, `EINVAL` 28, `EAGAIN` 6, `EBADF` 8, `EINTR` 27, `ENOTTY` 59, `EPIPE` 64,
`ECHILD` 12, `ESRCH` 71, `ENOSYS` 52, … `env.__syscall_*` imports return
`-errno`; `wasi_snapshot_preview1.*` imports return the positive errno.

Flags, signal numbers, ioctls, termios bits, wait options and poll bits use
Linux values. `sigset_t` is 8 bytes.

Struct layouts:

| Struct | Layout |
|---|---|
| `stat` (96) | dev u32@0, mode@4, nlink@8, uid@12, gid@16, rdev@20, size i64@24, blksize i32@32, blocks i32@36, atime sec i64@40 nsec u32@48, mtime @56/@64, ctime @72/@80, ino i64@88 |
| `statfs` | type@0, bsize@4, blocks i64@8, bfree@16, bavail@24, files@32, ffree@40, fsid@48, namelen@56, frsize@60, flags@64 |
| `dirent64` | ino u64@0, off i64@8, reclen u16@16, type u8@18, name@19 (reclen 8-byte aligned) |
| `termios` (60) | iflag@0, oflag@4, cflag@8, lflag@12, line@16, cc[32]@17, ispeed@52, ospeed@56 |
| `winsize` | rows u16, cols u16, xpixel u16, ypixel u16 |
| `pollfd` | fd i32@0, events i16@4, revents i16@6 |
| `iovec` | ptr u32, len u32 |
| `rusage` (152) | utime timeval@0, stime@16 (timeval: i64 sec, i32 usec; 16 bytes) |
| `sysinfo` (312) | uptime@0, loads[3]@4, totalram@16, freeram@20, shared@24, buffer@28, totalswap@32, freeswap@36, procs u16@40, mem_unit u32@52 |
| `fdstat` (WASI) | filetype u8@0, flags u16@2, rights i64@8 and @16 |

`isatty()` is implemented as "`fd_fdstat_get` reports filetype 2 (character
device)", so only terminals may report 2. `/dev/null` reports a regular file,
or `ls > /dev/null` would believe it writes to a terminal.

Imports of `busybox.wasm`:

```
bbw:  (the shim table above)
wasi: clock_time_get fd_fdstat_get fd_read fd_close fd_seek fd_write
      environ_sizes_get environ_get proc_exit fd_sync
env:  exit emscripten_get_now emscripten_date_now emscripten_resize_heap
      emscripten_get_heap_max _mmap_js _tzset_js _mktime_js _localtime_js
      strptime _emscripten_system _emscripten_lookup_name
      _emscripten_throw_longjmp invoke_{v,i,ii,iii,iiii,iiiii,iiiiii,vi,vii,viiii,ji}
      __syscall_{openat,fcntl64,ioctl,geteuid32,getegid32,getuid32,getgid32,
      unlinkat,renameat,pipe2,dup,dup3,chdir,fstat64,stat64,newfstatat,lstat64,
      readlinkat,poll,poll_nonblocking,fchmod,chmod,getcwd,getdents64,utimensat,
      umask,mkdirat,symlinkat,linkat,fchownat,fchown32,mknodat,ftruncate64,
      statfs64,faccessat,rmdir,fdatasync}
```

Exports used: `memory`, `__indirect_function_table`, `__wasm_call_ctors`,
`__main_argc_argv`, `malloc`, `free`, `emscripten_builtin_memalign`,
`__funcs_on_exit`, `fflush`, `setThrew`, `_emscripten_stack_alloc`,
`_emscripten_stack_restore`, `emscripten_stack_get_current`, `bbw_deliver`,
`bbw_sigsave`, `bbw_sigrestore`, `bbw_setup`,
`asyncify_{start,stop}_{unwind,rewind}`, `asyncify_get_state`.

`setjmp`/`longjmp` (used by `vi`, `test`, the decompressors) go through the
`invoke_*` imports. This works with Asyncify: an unwind passes through
`invoke_*` as a normal return, and on rewind the caller calls `invoke_*` again
with the same table entry.

## Testing

```sh
pnpm test:linux            # all cases
pnpm test:linux tar        # only cases whose command contains "tar"
```

`tests/linux.test.mjs` boots the system in Node with a fake terminal and runs
real commands: pipes, redirections, subshells, command substitution, scripts
with and without `#!`, `kill` and `wait`, FIFOs, `tar`/`gzip` round trips, `ps`,
`top`, `free`, `df`, signal traps, and interactive cases (`^C` during `sleep`,
`^Z` then `fg`, editing and saving a file in `vi`). Its `boot()` helper is also
useful for debugging.

In a browser, check that:

- nothing terminal-related is requested before the launcher is hovered or opened;
- commands run on desktop and mobile viewports;
- closing and reopening the window keeps the session and the prompt intact;
- `awk 'BEGIN { while (1); }'` followed by `^C` restarts the terminal.

## Deployment

- `docker/nginx.conf` enables gzip (including `application/wasm`) and serves
  `/assets/` with `Cache-Control: public, max-age=31536000, immutable`; Vite
  puts content hashes in those file names.
- The Dockerfile pre-compresses `*.wasm` after `pnpm build`, and nginx serves
  the `.gz` file directly (`gzip_static`).
- `WebAssembly.compileStreaming` requires the `application/wasm` MIME type,
  which nginx's default `mime.types` provides. If a server sends another type,
  the worker falls back to compiling from an `ArrayBuffer`.
- No COOP/COEP headers are needed or wanted.

Sizes:

| Asset | Loaded | Size |
|---|---|---|
| Main bundle | always | unchanged |
| Home chunk | always | +1.3 KB gzip (launcher and window) |
| `client-*.js` (xterm.js and glue) | on hover or open | 86 KB gzip |
| `worker-*.js` (kernel) | on open | 68 KB raw |
| `busybox-*.wasm` | on hover or open | 935 KB raw, 340 KB gzip |

## Limitations

- No network: there are no sockets, and `curl`, `ping` and package managers are
  stubs that say so.
- Single user (root) and a single terminal.
- The filesystem is not persisted between visits.
- A process that loops without reaching a yield point can only be stopped by
  the watchdog restarting the whole terminal. More yield points can be added
  with BusyBox patches if a particular applet needs them.
- Sleeping time keeps elapsing while a process is stopped: a `sleep` that is
  stopped with `^Z` past its deadline finishes as soon as it is continued.

## Licenses and credits

- **BusyBox** is licensed under GPL-2.0. `src/linux/busybox.wasm` is built from
  the unmodified BusyBox 1.37.0 release
  (<https://busybox.net/downloads/busybox-1.37.0.tar.bz2>) plus the patch,
  configuration and shim in `tools/busybox-wasm/`, which together are the
  complete corresponding source.
- `src/linux/kernel/time.ts` ports the local-time imports from Emscripten's
  `src/lib/libtime.js` (MIT).
- The wait-status encoding and default signal actions follow
  [ai-ecoverse/slicc-kernel](https://github.com/ai-ecoverse/slicc-kernel)
  (Apache-2.0), a similar project that runs Emscripten programs as processes
  but requires cross-origin isolation.
- The terminal is rendered by [xterm.js](https://xtermjs.org/) (MIT).
