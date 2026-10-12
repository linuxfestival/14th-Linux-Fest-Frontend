// Terminal line discipline (a small N_TTY): canonical line editing, echo,
// signal characters, VMIN/VTIME, output post-processing and window size.
import { E, IOCTL, POLL, SIG, T, VC } from "./constants.ts";

export const BLOCK = -0x7fff0000;

export interface TtyHost {
  /** Sends a signal to every process in a process group. */
  signalGroup(pgid: number, sig: number): void;
  /** Bytes for the terminal emulator. */
  output(bytes: Uint8Array): void;
  /** False while the emulator has too much unrendered output queued. */
  outputReady(): boolean;
  /** Something changed that blocked readers or writers may care about. */
  wake(): void;
}

export interface TtyCaller {
  pid: number;
  pgid: number;
  sid: number;
  /** True if the caller ignores or blocks the signal (no job-control stop). */
  ignoresSignal(sig: number): boolean;
}

const enc = new TextEncoder();

export class Tty {
  iflag = T.ICRNL | T.IXON | T.IUTF8;
  oflag = T.OPOST | T.ONLCR;
  cflag = T.B38400 | T.CS8 | T.CREAD;
  lflag = T.ISIG | T.ICANON | T.ECHO | T.ECHOE | T.ECHOK | T.ECHOCTL | T.ECHOKE | T.IEXTEN;
  cc = new Uint8Array(32);
  rows = 24;
  cols = 80;
  /** Foreground process group and owning session (0 = none). */
  fgPgrp = 0;
  sid = 0;

  /** Completed input ready for read(); zero-length entries are EOF marks. */
  private queue: Uint8Array[] = [];
  /** The line being edited in canonical mode, as characters. */
  private line: string[] = [];
  private literalNext = false;
  private host: TtyHost;
  private decoder = new TextDecoder();

  constructor(host: TtyHost) {
    this.host = host;
    const cc = this.cc;
    cc[VC.INTR] = 3;
    cc[VC.QUIT] = 28;
    cc[VC.ERASE] = 127;
    cc[VC.KILL] = 21;
    cc[VC.EOF] = 4;
    cc[VC.TIME] = 0;
    cc[VC.MIN] = 1;
    cc[VC.SUSP] = 26;
    cc[VC.REPRINT] = 18;
    cc[VC.WERASE] = 23;
    cc[VC.LNEXT] = 22;
  }

  private get canon() {
    return (this.lflag & T.ICANON) !== 0;
  }

  // ---- input from the emulator ----

  input(data: string | Uint8Array) {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    // Decode so that line editing erases whole UTF-8 characters.
    const text = this.decoder.decode(bytes, { stream: true });
    for (const ch of text) this.inputChar(ch);
    this.host.wake();
  }

  private inputChar(ch: string) {
    let c = ch.length === 1 ? ch.charCodeAt(0) : -1;
    const cc = this.cc;

    if (this.literalNext) {
      this.literalNext = false;
      this.addChar(ch);
      return;
    }
    if (c === 13) {
      if (this.iflag & T.IGNCR) return;
      if (this.iflag & T.ICRNL) {
        c = 10;
        ch = "\n";
      }
    } else if (c === 10 && this.iflag & T.INLCR) {
      c = 13;
      ch = "\r";
    }

    if (this.lflag & T.ISIG && c >= 0) {
      const sig = c === cc[VC.INTR] ? SIG.INT : c === cc[VC.QUIT] ? SIG.QUIT : c === cc[VC.SUSP] ? SIG.TSTP : 0;
      if (sig && c !== 0) {
        if (!(this.lflag & T.NOFLSH)) {
          this.queue = [];
          this.line = [];
        }
        this.echo(ch);
        if (this.fgPgrp) this.host.signalGroup(this.fgPgrp, sig);
        return;
      }
    }

    if (this.canon && c >= 0) {
      if (this.lflag & T.IEXTEN && c === cc[VC.LNEXT] && c !== 0) {
        this.literalNext = true;
        return;
      }
      if (c === cc[VC.ERASE] || c === 8) {
        this.erase(1);
        return;
      }
      if (c === cc[VC.KILL]) {
        this.erase(this.line.length);
        return;
      }
      if (c === cc[VC.WERASE] && this.lflag & T.IEXTEN) {
        let n = 0;
        while (n < this.line.length && /\s/.test(this.line[this.line.length - 1 - n])) n++;
        while (n < this.line.length && !/\s/.test(this.line[this.line.length - 1 - n])) n++;
        this.erase(n);
        return;
      }
      if (c === cc[VC.REPRINT] && this.lflag & T.IEXTEN) {
        this.echo(ch);
        this.writeOut("\n" + this.line.join(""));
        return;
      }
      if (c === cc[VC.EOF]) {
        this.queue.push(enc.encode(this.line.join("")));
        this.line = [];
        return;
      }
      if (c === 10 || (c === cc[VC.EOL] && c !== 0)) {
        this.line.push(ch);
        if (this.lflag & (T.ECHO | T.ECHONL)) this.writeOut(ch);
        this.queue.push(enc.encode(this.line.join("")));
        this.line = [];
        return;
      }
    }
    this.addChar(ch);
  }

  private addChar(ch: string) {
    if (this.canon) {
      if (this.line.length >= 4095) return;
      this.line.push(ch);
    } else {
      this.queue.push(enc.encode(ch));
    }
    this.echo(ch);
  }

  private echoWidth(ch: string) {
    const c = ch.charCodeAt(0);
    if (this.lflag & T.ECHOCTL && (c < 32 || c === 127) && ch !== "\t" && ch !== "\n") return 2;
    return 1;
  }

  private echo(ch: string) {
    if (!(this.lflag & T.ECHO)) return;
    const c = ch.charCodeAt(0);
    if (this.lflag & T.ECHOCTL && (c < 32 || c === 127) && ch !== "\t" && ch !== "\n") {
      this.writeOut("^" + String.fromCharCode(c === 127 ? 63 : c + 64));
    } else {
      this.writeOut(ch);
    }
  }

  private erase(n: number) {
    while (n-- > 0 && this.line.length) {
      const ch = this.line.pop()!;
      if (this.lflag & T.ECHO && this.lflag & T.ECHOE) this.writeOut("\b \b".repeat(this.echoWidth(ch)));
    }
  }

  // ---- reading ----

  private available() {
    let n = 0;
    for (const q of this.queue) n += q.length;
    return n;
  }

  /** Background readers get SIGTTIN, like Linux. Returns an errno or 0. */
  private jobControl(caller: TtyCaller, sig: number): number {
    if (!this.sid || caller.sid !== this.sid || caller.pgid === this.fgPgrp || !this.fgPgrp) return 0;
    if (caller.ignoresSignal(sig)) return sig === SIG.TTIN ? -E.EIO : 0;
    this.host.signalGroup(caller.pgid, sig);
    return -E.EINTR;
  }

  /**
   * Reads into dst. Returns bytes read, 0 at EOF, -errno, or BLOCK (in which
   * case `wait.until` may be set to a deadline in ms for VTIME).
   */
  read(dst: Uint8Array, caller: TtyCaller, nonblock: boolean, wait: { until?: number; started?: number }): number {
    const jc = this.jobControl(caller, SIG.TTIN);
    if (jc) return jc;
    if (dst.length === 0) return 0;

    if (this.canon) {
      if (!this.queue.length) return nonblock ? -E.EAGAIN : BLOCK;
      const first = this.queue[0];
      if (first.length === 0) {
        this.queue.shift();
        return 0;
      }
      const n = Math.min(first.length, dst.length);
      dst.set(first.subarray(0, n));
      if (n === first.length) this.queue.shift();
      else this.queue[0] = first.subarray(n);
      this.host.wake();
      return n;
    }

    const vmin = this.cc[VC.MIN];
    const vtime = this.cc[VC.TIME];
    const have = this.available();
    const want = Math.min(vmin, dst.length);
    if (have === 0 || (vmin > 0 && have < want)) {
      if (nonblock) return -E.EAGAIN;
      if (vmin === 0) {
        if (vtime === 0) return 0;
        const now = Date.now();
        wait.started ??= now;
        const until = wait.started + vtime * 100;
        if (now >= until) return 0;
        wait.until = until;
        return BLOCK;
      }
      return BLOCK;
    }
    let n = 0;
    while (n < dst.length && this.queue.length) {
      const q = this.queue[0];
      if (q.length === 0) {
        this.queue.shift();
        continue;
      }
      const take = Math.min(q.length, dst.length - n);
      dst.set(q.subarray(0, take), n);
      n += take;
      if (take === q.length) this.queue.shift();
      else this.queue[0] = q.subarray(take);
    }
    return n;
  }

  // ---- writing ----

  private writeOut(s: string) {
    this.host.output(this.post(enc.encode(s)));
  }

  private post(bytes: Uint8Array): Uint8Array {
    if (!(this.oflag & T.OPOST) || !(this.oflag & (T.ONLCR | T.OCRNL))) return bytes;
    let extra = 0;
    for (const b of bytes) if (b === 10) extra++;
    if (!extra || !(this.oflag & T.ONLCR)) return bytes;
    const out = new Uint8Array(bytes.length + extra);
    let j = 0;
    for (const b of bytes) {
      if (b === 10) out[j++] = 13;
      out[j++] = b;
    }
    return out;
  }

  write(src: Uint8Array, caller: TtyCaller, nonblock: boolean): number {
    if (this.lflag & T.TOSTOP) {
      const jc = this.jobControl(caller, SIG.TTOU);
      if (jc) return jc;
    }
    if (!this.host.outputReady()) return nonblock ? -E.EAGAIN : BLOCK;
    this.host.output(this.post(src));
    return src.length;
  }

  poll(): number {
    let r = POLL.OUT;
    if (this.canon ? this.queue.length > 0 : this.available() > 0) r |= POLL.IN;
    if (!this.host.outputReady()) r &= ~POLL.OUT;
    return r;
  }

  resize(rows: number, cols: number) {
    if (rows === this.rows && cols === this.cols) return;
    this.rows = rows;
    this.cols = cols;
    if (this.fgPgrp) this.host.signalGroup(this.fgPgrp, SIG.WINCH);
  }

  // ---- ioctl ----

  ioctl(op: number, argp: number, mem: DataView, caller: TtyCaller): number {
    switch (op) {
      case IOCTL.TCGETS: {
        mem.setUint32(argp, this.iflag, true);
        mem.setUint32(argp + 4, this.oflag, true);
        mem.setUint32(argp + 8, this.cflag, true);
        mem.setUint32(argp + 12, this.lflag, true);
        mem.setUint8(argp + 16, 0);
        for (let i = 0; i < 32; i++) mem.setUint8(argp + 17 + i, this.cc[i]);
        mem.setUint32(argp + 52, T.B38400, true);
        mem.setUint32(argp + 56, T.B38400, true);
        return 0;
      }
      case IOCTL.TCSETS:
      case IOCTL.TCSETSW:
      case IOCTL.TCSETSF: {
        const wasCanon = this.canon;
        this.iflag = mem.getUint32(argp, true);
        this.oflag = mem.getUint32(argp + 4, true);
        this.cflag = mem.getUint32(argp + 8, true);
        this.lflag = mem.getUint32(argp + 12, true);
        for (let i = 0; i < 32; i++) this.cc[i] = mem.getUint8(argp + 17 + i);
        if (op === IOCTL.TCSETSF) {
          this.queue = [];
          this.line = [];
        } else if (wasCanon && !this.canon && this.line.length) {
          this.queue.push(enc.encode(this.line.join("")));
          this.line = [];
        }
        this.host.wake();
        return 0;
      }
      case IOCTL.TIOCGWINSZ:
        mem.setUint16(argp, this.rows, true);
        mem.setUint16(argp + 2, this.cols, true);
        mem.setUint16(argp + 4, 0, true);
        mem.setUint16(argp + 6, 0, true);
        return 0;
      case IOCTL.TIOCSWINSZ:
        this.resize(mem.getUint16(argp, true), mem.getUint16(argp + 2, true));
        return 0;
      case IOCTL.TIOCGPGRP:
        if (caller.sid !== this.sid) return -E.ENOTTY;
        mem.setInt32(argp, this.fgPgrp, true);
        return 0;
      case IOCTL.TIOCSPGRP:
        if (caller.sid !== this.sid) return -E.ENOTTY;
        this.fgPgrp = mem.getInt32(argp, true);
        this.host.wake();
        return 0;
      case IOCTL.TIOCGSID:
        if (!this.sid) return -E.ENOTTY;
        mem.setInt32(argp, this.sid, true);
        return 0;
      case IOCTL.TIOCSCTTY:
        this.sid = caller.sid;
        this.fgPgrp = caller.pgid;
        return 0;
      case IOCTL.TIOCNOTTY:
        return 0;
      case IOCTL.FIONREAD:
        mem.setInt32(argp, this.available(), true);
        return 0;
      case IOCTL.TCFLSH:
        this.queue = [];
        this.line = [];
        return 0;
      case IOCTL.TCSBRK:
      case IOCTL.TCXONC:
      case IOCTL.FIONBIO:
        return 0;
    }
    return -E.EINVAL;
  }
}
