#!/usr/bin/env node
// Static check of busybox.wasm: which applets can reach a libc function that
// Emscripten compiled as a stub (unsupported, or faked for a single process)?
//
// Such calls never reach the kernel, so they can't be caught at the import
// boundary. This script builds the call graph of the binary and reports, for
// every stub, the applets that can call it and one example call path.
//
// Stubs are found three ways:
//   1. every function defined in Emscripten's libc stub files
//      (system/lib/libc/emscripten_{syscall,libc}_stubs.c), unless
//      shim/bbwasm.c replaces it
//   2. any function that returns -ENOSYS without calling anything
//   3. imports the kernel answers with ENOSYS (found by reading
//      src/linux/kernel/syscalls.ts) or only partly supports (KERNEL_LIMITS)
//
// Calls through function pointers (hush builtins, callbacks) are followed to
// every address-taken function with the same signature, except applet mains.
//
// Every reachable stub must be listed in REVIEWED with the reason it is
// harmless. Anything else fails the build (exit status 1).
//
// Usage: node tools/busybox-wasm/analyze.mjs [busybox.symbols.wasm] [--report FILE]
// Needs $EMSDK (wasm-dis and the libc sources). build.sh runs it.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const reportAt = args.indexOf("--report");
const reportFile = reportAt >= 0 ? args.splice(reportAt, 2)[1] : undefined;
const wasm = args[0] ?? join(HERE, "out/busybox.symbols.wasm");
const EMSDK = process.env.EMSDK;
if (!EMSDK) {
  console.error("analyze.mjs: $EMSDK is not set (source emsdk_env.sh)");
  process.exit(2);
}
const LIBC = join(EMSDK, "upstream/emscripten/system/lib/libc");

/** Imports whose kernel implementation returns ENOSYS somewhere. */
function kernelEnosys() {
  const src = readFileSync(join(HERE, "../../src/linux/kernel/syscalls.ts"), "utf8").split("\n");
  const out = new Set();
  let name;
  for (const line of src) {
    const m = /^ {4}([A-Za-z_][A-Za-z0-9_]*): /.exec(line);
    if (m) name = m[1];
    if (name && /\bE\.ENOSYS\b/.test(line)) out.add(name);
  }
  return out;
}
const KERNEL_ENOSYS = kernelEnosys();

/** Imports the kernel implements only partly. */
const KERNEL_LIMITS = {
  _emscripten_lookup_name: "host names from /etc/hosts only (no DNS)",
  _mmap_js: "file-backed mmap of regular files only, as a private copy",
};

/**
 * Stubs that applets can reach, each reviewed: why it is harmless here.
 * Keep the reason specific; a new entry needs the same scrutiny as code.
 */
const REVIEWED = {
  _emscripten_lookup_name:
    "No network exists; names in /etc/hosts (localhost, linuxfest) resolve, so `hostname -i` works.",
  _mmap_js:
    "dd only maps anonymous memory, which libc serves without this import; file mappings of regular files work.",
  __syscall_sync: "The filesystem is in memory; there is nothing to flush.",
  __syscall_getgroups32: "Reports group 0 only, which is true: the visitor is root with no supplementary groups.",
  getpwnam_r:
    "Only reached from musl glob() with GLOB_TILDE, which hush never passes (hush has no tilde expansion). " +
    "BusyBox's own user lookups use its /etc/passwd parser (CONFIG_USE_BB_PWD_GRP).",
  getpwuid_r: "Same as getpwnam_r.",
};

// ---- 1. stub names from Emscripten's libc sources ----

const C_FUNC = /^(?:weak\s+)?(?:static\s+)?(?:[a-z_]+\s+)+\**\s*([a-z_][a-z0-9_]*)\s*\(/gim;

function definedFunctions(src) {
  const names = new Set();
  for (const m of src.matchAll(C_FUNC)) names.add(m[1]);
  for (const m of src.matchAll(/^UNIMPLEMENTED\(\s*([a-z0-9_]+)/gim)) names.add("__syscall_" + m[1]);
  return names;
}

const emscriptenStubs = new Map();
for (const file of ["emscripten_syscall_stubs.c", "emscripten_libc_stubs.c"]) {
  for (const name of definedFunctions(readFileSync(join(LIBC, file), "utf8"))) emscriptenStubs.set(name, file);
}
const shimDefined = definedFunctions(readFileSync(join(HERE, "shim/bbwasm.c"), "utf8"));
// --wrap=NAME (build.sh) sends calls to __wrap_NAME in the shim.
for (const name of [...shimDefined]) if (name.startsWith("__wrap_")) shimDefined.add(name.slice(7));

// ---- 2. parse the binary (binaryen's text format) ----

const wat = execFileSync(join(EMSDK, "upstream/bin/wasm-dis"), [wasm], { maxBuffer: 1 << 30 }).toString();
const lines = wat.split("\n");

/** name → { calls: Set, indirect: Set of signatures, sig, body: string[] } */
const funcs = new Map();
/** type name → signature like "i32,i32->i32" */
const types = new Map();
const sigOf = (text) => {
  const params = [...text.matchAll(/\(param (?:\$\S+ )?([^()]+)\)/g)].flatMap((m) => m[1].trim().split(/\s+/));
  const results = [...text.matchAll(/\(result ([^()]+)\)/g)].flatMap((m) => m[1].trim().split(/\s+/));
  return params.join(",") + "->" + results.join(",");
};
/** internal name → "module.field" for imports */
const imports = new Map();
const addressTaken = new Set();
let current;
const NAME = /\$((?:\\.|[^\s()])+)/;

for (const line of lines) {
  if (line.startsWith(" (import ")) {
    const m = /^ \(import "([^"]+)" "([^"]+)" \(func \$((?:\\.|[^\s()])+)/.exec(line);
    if (m) imports.set(m[3], m[2]);
    continue;
  }
  if (line.startsWith(" (type ")) {
    const m = /^ \(type \$(\S+) \(func(.*)\)\)$/.exec(line);
    if (m) types.set(m[1], sigOf(m[2]));
    continue;
  }
  if (line.startsWith(" (elem ")) {
    for (const m of line.matchAll(/\$((?:\\.|[^\s()])+)/g)) addressTaken.add(m[1]);
    continue;
  }
  if (line.startsWith(" (func ")) {
    const name = NAME.exec(line)[1];
    current = { name, calls: new Set(), indirect: new Set(), sig: sigOf(line.slice(line.indexOf(name) + name.length)), body: [] };
    funcs.set(name, current);
    continue;
  }
  if (!current || !line.startsWith("  ")) {
    if (line.startsWith(" (")) current = undefined;
    continue;
  }
  current.body.push(line);
  const call = /\(call \$((?:\\.|[^\s()])+)/.exec(line);
  if (call) current.calls.add(call[1]);
  else {
    const ind = /\(call_indirect (?:\$\S+ )?\(type \$(\S+)\)/.exec(line);
    if (ind) current.indirect.add(ind[1]);
  }
}

// ---- classify stubs ----

/** name → { kind, why } */
const stubs = new Map();

for (const [name, file] of emscriptenStubs) {
  if (shimDefined.has(name) || !funcs.has(name)) continue;
  const enosys = funcs.get(name).body.some((l) => /\(i32\.const -52\)/.test(l));
  stubs.set(name, {
    kind: enosys ? "unsupported" : "faked",
    why: `Emscripten stub (${file})`,
  });
}
for (const [name, f] of funcs) {
  if (stubs.has(name)) continue;
  const calls = [...f.calls].filter((c) => c !== "__errno_location" && c !== "__syscall_ret");
  if (calls.length || f.body.length > 24) continue;
  if (f.body.some((l) => /\(i32\.const -?52\)/.test(l))) {
    stubs.set(name, { kind: "unsupported", why: "returns ENOSYS" });
  }
}
for (const [internal, field] of imports) {
  if (KERNEL_ENOSYS.has(field)) stubs.set(internal, { kind: "unsupported", why: "kernel returns ENOSYS" });
  else if (KERNEL_LIMITS[field]) stubs.set(internal, { kind: "limited", why: `kernel: ${KERNEL_LIMITS[field]}` });
}

// ---- applets: name → main function ----

function appletTable() {
  const h = readFileSync(join(HERE, "busybox-1.37.0/include/applet_tables.h"), "utf8");
  const namesBlock = /applet_names\[\] ALIGN1 = (.*?);/s.exec(h)[1];
  const names = [...namesBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1])
    .join("")
    .split("\\0")
    .filter(Boolean);
  const mains = /applet_main\[\]\)\(int argc, char \*\*argv\) = \{(.*?)\};/s
    .exec(h)[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const byMain = new Map();
  names.forEach((n, i) => {
    const main = mains[i];
    if (!byMain.has(main)) byMain.set(main, []);
    byMain.get(main).push(n);
  });
  return byMain;
}
const appletsByMain = appletTable();

// ---- reachability ----

// Function-pointer targets by signature. Applet mains are excluded: they are
// only called through the applet table (they are the roots here), and their
// int(int, char**) signature matches every two-argument callback.
const mains = new Set(appletsByMain.keys());
const targetsBySig = new Map();
for (const name of addressTaken) {
  const f = funcs.get(name);
  if (!f || mains.has(name)) continue;
  if (!targetsBySig.has(f.sig)) targetsBySig.set(f.sig, []);
  targetsBySig.get(f.sig).push(name);
}

/** Breadth-first search, direct calls first; returns parent links for paths. */
function reach(root) {
  const parent = new Map([[root, null]]);
  const viaPointer = new Set();
  const queue = [root];
  while (queue.length) {
    const f = queue.shift();
    if (stubs.has(f) && f !== root) continue; // report the stub, don't look inside it
    const fn = funcs.get(f);
    if (!fn) continue;
    for (const c of fn.calls) {
      if (!parent.has(c)) {
        parent.set(c, f);
        queue.push(c);
      }
    }
    for (const t of fn.indirect) {
      for (const c of targetsBySig.get(types.get(t)) ?? []) {
        if (!parent.has(c)) {
          parent.set(c, f);
          viaPointer.add(c);
          queue.push(c);
        }
      }
    }
  }
  return { parent, viaPointer };
}
const pathTo = ({ parent, viaPointer }, f) => {
  const p = [];
  for (let x = f; x; x = parent.get(x)) p.unshift((viaPointer.has(x) ? "*" : "") + x);
  return p;
};

/** stub → { direct: Set of applets, pointer: Set of applets, path } */
const found = new Map();
for (const [main, applets] of appletsByMain) {
  if (!funcs.has(main)) {
    console.error(`warning: ${main} (${applets.join(", ")}) is not in the binary`);
    continue;
  }
  const r = reach(main);
  for (const name of r.parent.keys()) {
    if (!stubs.has(name)) continue;
    const path = pathTo(r, name);
    const direct = !path.some((x) => x.startsWith("*"));
    if (!found.has(name)) found.set(name, { direct: new Set(), pointer: new Set(), path });
    const entry = found.get(name);
    for (const a of applets) (direct ? entry.direct : entry.pointer).add(a);
    // Prefer a direct path as the example, then the shortest one.
    const prevDirect = !entry.path.some((x) => x.startsWith("*"));
    if ((direct && !prevDirect) || (direct === prevDirect && path.length < entry.path.length)) entry.path = path;
  }
}

// ---- report ----

const display = (n) => (n.startsWith("*") ? "*" + (imports.get(n.slice(1)) ?? n.slice(1)) : (imports.get(n) ?? n));
const out = [];
const failures = [];
out.push("# busybox.wasm stub report", "");
out.push("Generated by `tools/busybox-wasm/analyze.mjs`. Lists every libc function compiled as a");
out.push("stub (or kernel import with limited support) that an applet can reach. In paths, `*name`");
out.push("marks a call through a function pointer (a possible target with the right signature).", "");
const sorted = [...found].sort((a, b) => display(a[0]).localeCompare(display(b[0])));
const list = (set) => {
  const l = [...set].sort();
  return l.length > 8 ? `${l.slice(0, 8).join(", ")} … (${l.length} applets)` : l.join(", ");
};
for (const kind of ["unsupported", "limited", "faked"]) {
  const rows = sorted.filter(([n]) => stubs.get(n).kind === kind);
  if (!rows.length) continue;
  out.push(`## ${kind}`, "");
  out.push("| Function | Reached by | Example path | Review |", "|---|---|---|---|");
  for (const [name, { direct, pointer, path }] of rows) {
    const shown = display(name);
    const review = REVIEWED[shown];
    if (!review) failures.push(shown);
    for (const a of direct) pointer.delete(a);
    const who = [
      direct.size ? list(direct) : "",
      pointer.size ? `possibly (via function pointers): ${list(pointer)}` : "",
    ].filter(Boolean).join("; ");
    out.push(`| \`${shown}\` | ${who} | ${path.map(display).join(" → ")} | ${review ?? "**not reviewed**"} |`);
  }
  out.push("");
}
const stale = Object.keys(REVIEWED).filter((n) => ![...found.keys()].some((f) => display(f) === n));
if (stale.length) out.push(`Reviewed entries no longer reachable (remove them): ${stale.join(", ")}`, "");

const text = out.join("\n");
if (reportFile) writeFileSync(reportFile, text + "\n");
else console.log(text);

if (failures.length) {
  console.error(`\n${failures.length} reachable stub(s) not reviewed: ${failures.join(", ")}`);
  console.error("Fix them in shim/bbwasm.c or the kernel, or add a reason to REVIEWED in analyze.mjs.");
  process.exit(1);
}
console.error(`ok: ${found.size} reachable stub(s), all reviewed`);
