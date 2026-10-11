// Builds src/linux/ctf.pack from the private puzzle source.
//
//   node tools/ctf/build.mjs [path/to/puzzles.mjs] [path/to/codes.json]
//
// Defaults: tools/ctf/private/puzzles.mjs and tools/ctf/private/codes.json.
// The private folder is gitignored: it holds the answers. Keep a copy of it
// somewhere safe; without it the pack cannot be rebuilt with the same flags.
//
// puzzles.mjs default-exports an array of
//   { id, title, level (1-5), intro, files: {path: content | {data, mode}},
//     stages: [{ answer, message, files }] }
// Stage i is opened by its answer; the last stage is the reward, and "{{code}}"
// in its message is replaced by codes.json[id].
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { KDF_ITERATIONS, answerKey, normalize, seal, sealBase, toB64 } from "../../src/linux/ctf.ts";
import { bytes } from "./lib.mjs";

const here = new URL(".", import.meta.url).pathname;
const puzzlesPath = resolve(process.argv[2] ?? `${here}private/puzzles.mjs`);
const codesPath = resolve(process.argv[3] ?? `${here}private/codes.json`);
const outPath = resolve(here, "../../src/linux/ctf.pack");

const puzzles = (await import(pathToFileURL(puzzlesPath).href)).default;
const codes = existsSync(codesPath) ? JSON.parse(readFileSync(codesPath, "utf8")) : {};

const packFiles = (files = {}) =>
  Object.fromEntries(
    Object.entries(files).map(([path, f]) => {
      const { data, mode } = typeof f === "string" || f instanceof Uint8Array ? { data: f } : f;
      return [path, { data: toB64(bytes(data)), ...(mode ? { mode } : {}) }];
    }),
  );

const seen = new Set();
const missing = [];
const base = { puzzles: [], files: {} };
const stages = [];
const salt = crypto.getRandomValues(new Uint8Array(16));

for (const p of puzzles) {
  base.puzzles.push({ id: p.id, title: p.title, level: p.level, intro: p.intro, steps: p.stages.length });
  Object.assign(base.files, packFiles(p.files));
  for (const [i, s] of p.stages.entries()) {
    const a = normalize(s.answer);
    if (a.length < 12) throw new Error(`${p.id} stage ${i + 1}: answer too short to resist guessing`);
    if (seen.has(a)) throw new Error(`${p.id} stage ${i + 1}: answer used twice`);
    seen.add(a);
    const final = i === p.stages.length - 1;
    let message = s.message;
    if (final) {
      const code = codes[p.id];
      if (!code) missing.push(p.id);
      message = message.replaceAll("{{code}}", code ?? `PLACEHOLDER-${p.id.toUpperCase()}`);
    }
    const key = await answerKey(s.answer, salt, KDF_ITERATIONS);
    stages.push(await seal(key, { puzzle: p.id, step: i + 1, final, message, files: packFiles(s.files) }));
  }
}

// Shuffle, so the order says nothing about which stage belongs to what.
for (let i = stages.length - 1; i > 0; i--) {
  const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
  [stages[i], stages[j]] = [stages[j], stages[i]];
}

const pack = { v: 1, salt: toB64(salt), iter: KDF_ITERATIONS, base: await sealBase(base), stages };
writeFileSync(outPath, JSON.stringify(pack));
console.log(`wrote ${outPath}: ${puzzles.length} puzzles, ${stages.length} stages`);
if (missing.length) console.log(`no code yet for: ${missing.join(", ")} (placeholders used)`);
