// Helpers for writing CTF puzzle files: archives and encodings in the exact
// formats BusyBox reads back (tar, gzip, base64, base32, xxd -p).
import { gzipSync } from "node:zlib";

const enc = new TextEncoder();
export const bytes = (s) => (typeof s === "string" ? enc.encode(s) : s);

/** A ustar archive of {path: content}. Directories are implied. */
export function tar(entries, mtime = 1_734_000_000) {
  const blocks = [];
  for (const [path, content] of Object.entries(entries)) {
    const data = bytes(content);
    const h = new Uint8Array(512);
    const put = (off, len, s) => h.set(enc.encode(s).subarray(0, len), off);
    const oct = (off, len, n) => put(off, len, n.toString(8).padStart(len - 1, "0") + "\0");
    put(0, 100, path);
    oct(100, 8, 0o644);
    oct(108, 8, 0);
    oct(116, 8, 0);
    oct(124, 12, data.length);
    oct(136, 12, mtime);
    h.fill(32, 148, 156); // checksum field counts as spaces
    put(156, 1, "0");
    put(257, 6, "ustar\0");
    put(263, 2, "00");
    put(265, 32, "root");
    put(297, 32, "root");
    const sum = h.reduce((a, b) => a + b, 0);
    put(148, 8, sum.toString(8).padStart(6, "0") + "\0 ");
    blocks.push(h, data, new Uint8Array((512 - (data.length % 512)) % 512));
  }
  blocks.push(new Uint8Array(1024));
  const out = new Uint8Array(blocks.reduce((n, b) => n + b.length, 0));
  let o = 0;
  for (const b of blocks) {
    out.set(b, o);
    o += b.length;
  }
  return out;
}

export const gzip = (data) => new Uint8Array(gzipSync(bytes(data), { level: 9 }));

const lines = (s, width) => (s.match(new RegExp(`.{1,${width}}`, "g")) ?? []).join("\n") + "\n";

export const base64 = (data, width = 76) => lines(Buffer.from(bytes(data)).toString("base64"), width);

export function base32(data, width = 76) {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const b = bytes(data);
  let out = "";
  let bits = 0;
  let v = 0;
  for (const x of b) {
    v = (v << 8) | x;
    bits += 8;
    while (bits >= 5) {
      out += A[(v >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits) out += A[(v << (5 - bits)) & 31];
  while (out.length % 8) out += "=";
  return lines(out, width);
}

/** Like `xxd -p`: 30 bytes (60 hex digits) per line. */
export const hex = (data) => lines(Buffer.from(bytes(data)).toString("hex"), 60);

export const rot13 = (s) => s.replace(/[a-z]/gi, (c) => String.fromCharCode(((c.toLowerCase().charCodeAt(0) - 97 + 13) % 26) + (c < "a" ? 65 : 97)));

/** Reverses each line, like `rev`. */
export const rev = (s) => s.split("\n").map((l) => [...l].reverse().join("")).join("\n");

/** Repeating-key XOR, written as decimal byte values. */
export function xorDecimal(text, key, perLine = 16) {
  const t = bytes(text);
  const k = bytes(key);
  const nums = [...t].map((x, i) => x ^ k[i % k.length]);
  const out = [];
  for (let i = 0; i < nums.length; i += perLine) out.push(nums.slice(i, i + perLine).join(" "));
  return out.join("\n") + "\n";
}

export const MORSE = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
};

export const morse = (s) => [...s.toLowerCase()].map((c) => MORSE[c]).join(" ");
