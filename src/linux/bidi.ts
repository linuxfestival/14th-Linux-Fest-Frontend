// Right-to-left text (Persian, Arabic, Hebrew) for the terminal grid.
//
// xterm.js has no bidi support: it puts characters in cells in the order they
// arrive. Its DOM renderer then draws runs of cells as inline-block spans, and
// the browser reorders RTL text only inside each span, so a Persian title came
// out partly reversed. terminal.css turns browser reordering off; text meant
// for the screen goes through visual() first, as in terminals that do bidi
// themselves (mlterm, VTE): Arabic letters become their joined presentation
// forms, then each line is put in display order.

/** Isolated, final, initial, medial; right-joining letters have only the first two. */
const FORMS: Record<number, number[]> = {
  0x0622: [0xfe81, 0xfe82],
  0x0623: [0xfe83, 0xfe84],
  0x0624: [0xfe85, 0xfe86],
  0x0625: [0xfe87, 0xfe88],
  0x0626: [0xfe89, 0xfe8a, 0xfe8b, 0xfe8c],
  0x0627: [0xfe8d, 0xfe8e],
  0x0628: [0xfe8f, 0xfe90, 0xfe91, 0xfe92],
  0x0629: [0xfe93, 0xfe94],
  0x062a: [0xfe95, 0xfe96, 0xfe97, 0xfe98],
  0x062b: [0xfe99, 0xfe9a, 0xfe9b, 0xfe9c],
  0x062c: [0xfe9d, 0xfe9e, 0xfe9f, 0xfea0],
  0x062d: [0xfea1, 0xfea2, 0xfea3, 0xfea4],
  0x062e: [0xfea5, 0xfea6, 0xfea7, 0xfea8],
  0x062f: [0xfea9, 0xfeaa],
  0x0630: [0xfeab, 0xfeac],
  0x0631: [0xfead, 0xfeae],
  0x0632: [0xfeaf, 0xfeb0],
  0x0633: [0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4],
  0x0634: [0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8],
  0x0635: [0xfeb9, 0xfeba, 0xfebb, 0xfebc],
  0x0636: [0xfebd, 0xfebe, 0xfebf, 0xfec0],
  0x0637: [0xfec1, 0xfec2, 0xfec3, 0xfec4],
  0x0638: [0xfec5, 0xfec6, 0xfec7, 0xfec8],
  0x0639: [0xfec9, 0xfeca, 0xfecb, 0xfecc],
  0x063a: [0xfecd, 0xfece, 0xfecf, 0xfed0],
  0x0641: [0xfed1, 0xfed2, 0xfed3, 0xfed4],
  0x0642: [0xfed5, 0xfed6, 0xfed7, 0xfed8],
  0x0643: [0xfed9, 0xfeda, 0xfedb, 0xfedc],
  0x0644: [0xfedd, 0xfede, 0xfedf, 0xfee0],
  0x0645: [0xfee1, 0xfee2, 0xfee3, 0xfee4],
  0x0646: [0xfee5, 0xfee6, 0xfee7, 0xfee8],
  0x0647: [0xfee9, 0xfeea, 0xfeeb, 0xfeec],
  0x0648: [0xfeed, 0xfeee],
  0x0649: [0xfeef, 0xfef0],
  0x064a: [0xfef1, 0xfef2, 0xfef3, 0xfef4],
  // Persian
  0x067e: [0xfb56, 0xfb57, 0xfb58, 0xfb59],
  0x0686: [0xfb7a, 0xfb7b, 0xfb7c, 0xfb7d],
  0x0698: [0xfb8a, 0xfb8b],
  0x06a9: [0xfb8e, 0xfb8f, 0xfb90, 0xfb91],
  0x06af: [0xfb92, 0xfb93, 0xfb94, 0xfb95],
  0x06c0: [0xfba4, 0xfba5],
  0x06cc: [0xfbfc, 0xfbfd, 0xfbfe, 0xfbff],
};

/** Lam + alef (madda, hamza above, hamza below, plain) → ligature, isolated and final. */
const LAM_ALEF: Record<number, [number, number]> = {
  0x0622: [0xfef5, 0xfef6],
  0x0623: [0xfef7, 0xfef8],
  0x0625: [0xfef9, 0xfefa],
  0x0627: [0xfefb, 0xfefc],
};

const TATWEEL = 0x0640;
const LAM = 0x0644;
/** Harakat and other marks: dropped, since they would land in the wrong cell once reordered. */
const MARK = /[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g;
/** Zero-width (non-)joiners: they decide the forms in shape(), then go. */
const JOINER = /[\u200c\u200d]/g;

/** Can join the letter after it. */
const joinsNext = (c: number | undefined) => c === TATWEEL || (c !== undefined && FORMS[c]?.length === 4);
/** Can join the letter before it. */
const joinsPrev = (c: number | undefined) => c === TATWEEL || (c !== undefined && c in FORMS);

/** Replaces Arabic letters with the presentation form for their position. */
export function shape(s: string): string {
  const cps = [...s].map((c) => c.codePointAt(0)!);
  const out: number[] = [];
  for (let i = 0; i < cps.length; i++) {
    const c = cps[i];
    const forms = FORMS[c];
    if (!forms) {
      out.push(c);
      continue;
    }
    const prev = joinsNext(cps[i - 1]);
    if (c === LAM && LAM_ALEF[cps[i + 1]]) {
      out.push(LAM_ALEF[cps[i + 1]][prev ? 1 : 0]);
      i++;
      continue;
    }
    const next = forms.length === 4 && joinsPrev(cps[i + 1]);
    out.push(forms[prev ? (next ? 3 : 1) : next ? 2 : 0]);
  }
  return String.fromCodePoint(...out);
}

const RTL = /[\u0590-\u05ff\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb1d-\ufdff\ufe70-\ufeff]/;
const DIGIT = /[0-9\u0660-\u0669\u06f0-\u06f9]/;
const LETTER = /\p{L}/u;
const MIRROR: Record<string, string> = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", "«": "»", "»": "«" };

type Kind = "R" | "L" | "N" | "W";
/** R: RTL letter, L: other letter, N: digit, W: neutral (space, punctuation). */
const kind = (ch: string): Kind => (RTL.test(ch) && !DIGIT.test(ch) ? "R" : DIGIT.test(ch) ? "N" : LETTER.test(ch) ? "L" : "W");

/**
 * One line in display order: a simplified Unicode bidi algorithm (paragraph
 * direction from the first strong letter, digit runs kept left to right,
 * neutrals take the direction of the letters around them, mirrored brackets).
 */
export function reorder(line: string): string {
  const chars = [...line];
  if (!chars.some((c) => kind(c) === "R")) return line;
  const kinds = chars.map(kind);
  const firstStrong = kinds.find((k) => k === "R" || k === "L");
  const base = firstStrong === "R" ? 1 : 0;

  // Strong direction of each char (digits count as R next to RTL text, as in UBA W2/N1).
  const dir: ("R" | "L" | undefined)[] = [];
  let lastStrong: "R" | "L" = base ? "R" : "L";
  for (let i = 0; i < chars.length; i++) {
    const k = kinds[i];
    if (k === "R" || k === "L") lastStrong = k;
    dir[i] = k === "R" ? "R" : k === "L" ? "L" : k === "N" ? (lastStrong === "R" ? "R" : "L") : undefined;
  }
  // Bracket pairs resolve together (UBA N0): the base direction if the text
  // inside has any, else the other direction if the text inside and before
  // the pair are both that way.
  const baseDir = base ? "R" : "L";
  const open: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    if ("([{".includes(chars[i])) open.push(i);
    else if (")]}".includes(chars[i]) && open.length && MIRROR[chars[open[open.length - 1]]] === chars[i]) {
      const o = open.pop()!;
      const inside = new Set(dir.slice(o + 1, i).filter(Boolean));
      if (!inside.size) continue;
      let d: "R" | "L" = baseDir;
      if (!inside.has(baseDir)) {
        const before = dir.slice(0, o).filter(Boolean).pop() ?? baseDir;
        if (before !== baseDir) d = before;
      }
      dir[o] = dir[i] = d;
    }
  }
  // Neutrals: the direction of the strong chars on both sides if they agree, else the base.
  for (let i = 0; i < chars.length; ) {
    if (dir[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j < chars.length && !dir[j]) j++;
    const before = i > 0 ? dir[i - 1] : base ? "R" : "L";
    const after = j < chars.length ? dir[j] : base ? "R" : "L";
    const d = before === after ? before : base ? "R" : "L";
    for (let x = i; x < j; x++) dir[x] = d;
    i = j;
  }
  // Levels: RTL 1; LTR 0 (2 inside an RTL line); digits next to RTL text 2.
  const levels = chars.map((_, i) => {
    if (kinds[i] === "N" && dir[i] === "R") return 2;
    if (dir[i] === "R") return 1;
    return base ? 2 : 0;
  });
  // Leading and trailing spaces stay where they are: on the terminal grid they
  // are indentation and column padding, not part of the text.
  for (let i = 0; i < chars.length && chars[i] === " "; i++) levels[i] = 0;
  for (let i = chars.length - 1; i >= 0 && chars[i] === " "; i--) levels[i] = 0;

  const out = chars.map((c, i) => (levels[i] % 2 && MIRROR[c] ? MIRROR[c] : c));
  const order = chars.map((_, i) => i);
  const max = Math.max(...levels);
  for (let level = max; level >= 1; level--) {
    for (let i = 0; i < order.length; ) {
      if (levels[order[i]] < level) {
        i++;
        continue;
      }
      let j = i;
      while (j < order.length && levels[order[j]] >= level) j++;
      order.splice(i, j - i, ...order.slice(i, j).reverse());
      i = j;
    }
  }
  return order.map((i) => out[i]).join("");
}

/**
 * Text for the terminal screen: shaped and in display order. Each line, and
 * each column of a table (text between runs of two or more spaces), is
 * ordered on its own, so an RTL title stays in its column.
 */
export const visual = (s: string) =>
  RTL.test(s)
    ? s
        .split(/(\n| {2,})/)
        .map((part, i) => (i % 2 ? part : reorder(shape(part.replace(MARK, "")).replace(JOINER, ""))))
        .join("")
    : s;
