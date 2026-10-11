// Capture-the-flag puzzles hidden in the terminal (`ctf`).
//
// The pack (src/linux/ctf.pack) is built by tools/ctf/build.mjs from a private
// source that is not in the repository. Its layers:
//
// - base: puzzle titles, intros and the files each puzzle starts with,
//   encrypted with a key that is in this file. That only keeps the content
//   out of reach of grep; anyone reading the code can decrypt it.
// - stages: one per answer. Each is encrypted with AES-GCM under a key derived
//   from the answer that opens it (PBKDF2-SHA256), so its content (new files,
//   and in the end the discount code) cannot be read before the puzzle is
//   solved. Stages are shuffled and carry no labels.
//
// Answers are random tokens with enough entropy that guessing them offline is
// not practical.

export interface PackFile {
  /** base64 */
  data: string;
  mode?: number;
}

interface Sealed {
  iv: string;
  ct: string;
}

export interface Pack {
  v: 1;
  salt: string;
  iter: number;
  base: Sealed;
  stages: Sealed[];
}

export interface PuzzleInfo {
  id: string;
  title: string;
  /** 1 (easy) to 5 (hard) */
  level: number;
  intro: string;
  /** Number of answers the puzzle takes. */
  steps: number;
}

export interface Base {
  puzzles: PuzzleInfo[];
  files: Record<string, PackFile>;
}

export interface Stage {
  puzzle: string;
  /** 1-based: the answer number that opens this stage. */
  step: number;
  final: boolean;
  message: string;
  files?: Record<string, PackFile>;
}

export const BASE_SECRET = "linuxfest-15-ctf-base";
export const KDF_ITERATIONS = 600_000;

const enc = new TextEncoder();
const dec = new TextDecoder();

export const toB64 = (b: Uint8Array) => {
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};
export const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

/** Answers are compared without case, surrounding space or an lf{...} wrapper. */
export function normalize(answer: string) {
  const a = answer.trim().toLowerCase();
  const m = /^lf\{(.*)\}$/.exec(a);
  return (m ? m[1] : a).trim();
}

async function baseKey() {
  const raw = await crypto.subtle.digest("SHA-256", enc.encode(BASE_SECRET));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function answerKey(answer: string, salt: Uint8Array, iter: number) {
  const material = await crypto.subtle.importKey("raw", enc.encode(normalize(answer)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: iter },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function seal(key: CryptoKey, value: unknown): Promise<Sealed> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(value)));
  return { iv: toB64(iv), ct: toB64(new Uint8Array(ct)) };
}

/** The decrypted value, or undefined if the key is wrong. */
export async function unseal<T>(key: CryptoKey, s: Sealed): Promise<T | undefined> {
  try {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(s.iv) }, key, fromB64(s.ct));
    return JSON.parse(dec.decode(pt)) as T;
  } catch {
    return undefined;
  }
}

export const sealBase = async (base: Base) => seal(await baseKey(), base);

export async function openBase(pack: Pack): Promise<Base> {
  const base = await unseal<Base>(await baseKey(), pack.base);
  if (!base) throw new Error("ctf: corrupt pack");
  return base;
}

export const fileBytes = (f: PackFile) => fromB64(f.data);

type WriteFile = (path: string, data: Uint8Array, mode?: number) => void;

const STARS = (n: number) => "*".repeat(n) + ".".repeat(5 - n);

/** Puzzle state for one terminal session. */
export class Ctf {
  private pack: Pack;
  private base: Base;
  private write: WriteFile;
  private salt: Uint8Array;
  /** Indexes of stages already open. */
  private opened = new Set<number>();
  /** Highest step solved per puzzle. */
  private progress = new Map<string, number>();
  private rewards = new Map<string, string>();

  constructor(pack: Pack, base: Base, write: WriteFile) {
    this.pack = pack;
    this.base = base;
    this.write = write;
    this.salt = fromB64(pack.salt);
  }

  /** Files every puzzle starts with. */
  get files() {
    return this.base.files;
  }

  /** Tries an answer against every closed stage. Returns the stage it opened. */
  async submit(answer: string): Promise<Stage | undefined> {
    if (!normalize(answer)) return undefined;
    const key = await answerKey(answer, this.salt, this.pack.iter);
    for (let i = 0; i < this.pack.stages.length; i++) {
      if (this.opened.has(i)) continue;
      const stage = await unseal<Stage>(key, this.pack.stages[i]);
      if (!stage) continue;
      this.opened.add(i);
      this.progress.set(stage.puzzle, Math.max(this.progress.get(stage.puzzle) ?? 0, stage.step));
      for (const [path, f] of Object.entries(stage.files ?? {})) this.write(path, fileBytes(f), f.mode);
      if (stage.final) this.rewards.set(stage.puzzle, stage.message);
      return stage;
    }
    return undefined;
  }

  /** Handles `ctf ...` (args after "ctf"). */
  async command(args: string[], color: boolean): Promise<{ status: number; body: string; solved?: string }> {
    const c = (code: string, s: string) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
    const [sub, ...rest] = args;
    if (!sub || sub === "list" || sub === "help") {
      const lines = [
        c("1", "Capture the flag") + ": discount codes are hidden on this machine.",
        "",
        "Each puzzle ends in a flag like lf{...}. Submit it with: ctf submit <flag>",
        "Some puzzles take more than one flag. Progress is kept in this browser.",
        "",
      ];
      this.base.puzzles.forEach((p, i) => {
        const done = this.progress.get(p.id) ?? 0;
        const state =
          done >= p.steps ? c("1;32", "solved") : done ? c("33", `${done}/${p.steps} flags`) : c("2", "unsolved");
        lines.push(`${i + 1}. ${c("1", p.title)}  ${c("33", STARS(p.level))}  ${state}`);
        lines.push(`   ${p.intro}`);
      });
      lines.push("", "ctf codes    show the discount codes you have won");
      return { status: 0, body: lines.join("\n") + "\n" };
    }
    if (sub === "submit") {
      const answer = rest.join(" ");
      if (!answer) return { status: 2, body: "usage: ctf submit <flag>\n" };
      const stage = await this.submit(answer);
      if (!stage) return { status: 1, body: "ctf: that is not a flag (or you already used it)\n" };
      const title = this.base.puzzles.find((p) => p.id === stage.puzzle)?.title ?? stage.puzzle;
      const head = stage.final ? c("1;32", `Solved: ${title}!`) : c("1;33", `${title}: flag ${stage.step} accepted.`);
      return { status: 0, body: `${head}\n\n${stage.message.trimEnd()}\n`, solved: answer };
    }
    if (sub === "codes") {
      if (!this.rewards.size) return { status: 0, body: "No codes yet. Run ctf to see the puzzles.\n" };
      const lines = [...this.rewards].map(([id, msg]) => {
        const title = this.base.puzzles.find((p) => p.id === id)?.title ?? id;
        return `${c("1", title)}\n${msg.trimEnd()}\n`;
      });
      return { status: 0, body: lines.join("\n") };
    }
    return { status: 2, body: `ctf: unknown command '${sub}'. Try: ctf, ctf submit <flag>, ctf codes\n` };
  }
}

export async function loadCtf(bytes: Uint8Array, write: WriteFile) {
  const pack = JSON.parse(dec.decode(bytes)) as Pack;
  return new Ctf(pack, await openBase(pack), write);
}
