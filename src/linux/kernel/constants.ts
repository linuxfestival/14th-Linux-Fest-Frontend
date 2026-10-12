// ABI constants for the Emscripten (wasm32, musl) build of BusyBox.
// Emscripten numbers errno values the WASI way, not the Linux way.

export const E = {
  OK: 0,
  E2BIG: 1,
  EACCES: 2,
  EAGAIN: 6,
  EBADF: 8,
  EBUSY: 10,
  ECHILD: 12,
  EEXIST: 20,
  EFAULT: 21,
  EFBIG: 22,
  EINTR: 27,
  EINVAL: 28,
  EIO: 29,
  EISDIR: 31,
  ELOOP: 32,
  EMFILE: 33,
  EMLINK: 34,
  ENAMETOOLONG: 37,
  ENODEV: 43,
  ENOENT: 44,
  ENOEXEC: 45,
  ENOMEM: 48,
  ENOSPC: 51,
  ENOSYS: 52,
  ENOTDIR: 54,
  ENOTEMPTY: 55,
  ENOTTY: 59,
  ENXIO: 60,
  EPERM: 63,
  EPIPE: 64,
  ERANGE: 68,
  EROFS: 69,
  ESPIPE: 70,
  ESRCH: 71,
  EXDEV: 75,
  EOPNOTSUPP: 138,
} as const;

export const O = {
  ACCMODE: 3,
  RDONLY: 0,
  WRONLY: 1,
  RDWR: 2,
  CREAT: 0o100,
  EXCL: 0o200,
  NOCTTY: 0o400,
  TRUNC: 0o1000,
  APPEND: 0o2000,
  NONBLOCK: 0o4000,
  DIRECTORY: 0o200000,
  NOFOLLOW: 0o400000,
  CLOEXEC: 0o2000000,
  PATH: 0o10000000,
} as const;

export const AT = {
  FDCWD: -100,
  SYMLINK_NOFOLLOW: 0x100,
  REMOVEDIR: 0x200,
  EACCESS: 0x200,
  SYMLINK_FOLLOW: 0x400,
  EMPTY_PATH: 0x1000,
} as const;

export const S = {
  IFMT: 0o170000,
  IFIFO: 0o010000,
  IFCHR: 0o020000,
  IFDIR: 0o040000,
  IFREG: 0o100000,
  IFLNK: 0o120000,
} as const;

export const SIG = {
  HUP: 1,
  INT: 2,
  QUIT: 3,
  ILL: 4,
  TRAP: 5,
  ABRT: 6,
  BUS: 7,
  FPE: 8,
  KILL: 9,
  USR1: 10,
  SEGV: 11,
  USR2: 12,
  PIPE: 13,
  ALRM: 14,
  TERM: 15,
  CHLD: 17,
  CONT: 18,
  STOP: 19,
  TSTP: 20,
  TTIN: 21,
  TTOU: 22,
  URG: 23,
  XCPU: 24,
  XFSZ: 25,
  VTALRM: 26,
  PROF: 27,
  WINCH: 28,
  IO: 29,
  PWR: 30,
  SYS: 31,
} as const;

export const SIGNAL_NAMES: Record<number, string> = Object.fromEntries(
  Object.entries(SIG).map(([k, v]) => [v, "SIG" + k]),
);

// Default actions: what the kernel does when the disposition is SIG_DFL.
export const SIG_IGNORED_BY_DEFAULT = new Set<number>([SIG.CHLD, SIG.URG, SIG.WINCH, SIG.CONT]);
export const SIG_STOPS = new Set<number>([SIG.STOP, SIG.TSTP, SIG.TTIN, SIG.TTOU]);

export const W = { NOHANG: 1, UNTRACED: 2, CONTINUED: 8 } as const;

export const POLL = { IN: 1, PRI: 2, OUT: 4, ERR: 8, HUP: 16, NVAL: 32 } as const;

export const IOCTL = {
  TCGETS: 21505,
  TCSETS: 21506,
  TCSETSW: 21507,
  TCSETSF: 21508,
  TCSBRK: 21513,
  TCXONC: 21514,
  TCFLSH: 21515,
  TIOCSCTTY: 21518,
  TIOCGPGRP: 21519,
  TIOCSPGRP: 21520,
  TIOCGWINSZ: 21523,
  TIOCSWINSZ: 21524,
  FIONREAD: 21531,
  FIONBIO: 21537,
  TIOCNOTTY: 21538,
  TIOCGSID: 21545,
} as const;

export const F = {
  DUPFD: 0,
  GETFD: 1,
  SETFD: 2,
  GETFL: 3,
  SETFL: 4,
  GETLK: 12,
  SETLK: 13,
  SETLKW: 14,
  DUPFD_CLOEXEC: 1030,
} as const;

// termios flag bits (octal, as in <bits/termios.h>)
export const T = {
  // c_iflag
  IGNBRK: 0o1,
  BRKINT: 0o2,
  ISTRIP: 0o40,
  INLCR: 0o100,
  IGNCR: 0o200,
  ICRNL: 0o400,
  IXON: 0o2000,
  IUTF8: 0o40000,
  // c_oflag
  OPOST: 0o1,
  ONLCR: 0o4,
  OCRNL: 0o10,
  // c_cflag
  B38400: 0o17,
  CS8: 0o60,
  CREAD: 0o200,
  // c_lflag
  ISIG: 0o1,
  ICANON: 0o2,
  ECHO: 0o10,
  ECHOE: 0o20,
  ECHOK: 0o40,
  ECHONL: 0o100,
  NOFLSH: 0o200,
  TOSTOP: 0o400,
  ECHOCTL: 0o1000,
  ECHOKE: 0o4000,
  IEXTEN: 0o100000,
} as const;

export const VC = {
  INTR: 0,
  QUIT: 1,
  ERASE: 2,
  KILL: 3,
  EOF: 4,
  TIME: 5,
  MIN: 6,
  SUSP: 10,
  EOL: 11,
  REPRINT: 12,
  WERASE: 14,
  LNEXT: 15,
} as const;

// WASI filetype values returned by fd_fdstat_get. Emscripten's isatty() is
// "filetype == CHARACTER_DEVICE", so only terminals report 2.
export const FILETYPE = { UNKNOWN: 0, CHAR: 2, DIR: 3, REG: 4, SYMLINK: 7 } as const;

export const PAGE = 65536;
