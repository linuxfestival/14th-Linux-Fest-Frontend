/// <reference lib="webworker" />
// Web Worker entry: runs the kernel and every BusyBox process.
//
// in:  boot {wasmUrl, ctfUrl, ctfAnswers, rows, cols, files}, input {data},
//      resize {rows, cols}, ack {bytes}, ping, reply {id, status, body}
// out: ready, output {bytes} (batched, transferred), pong, error {message},
//      request {id, args, cols} (a `fest` command for the page),
//      ctf-solved {answer} (for the page to remember)
import { type Ctf, fileBytes, loadCtf } from "./ctf.ts";
import type { ServiceReply } from "./kernel/files.ts";
import type { Kernel } from "./kernel/kernel.ts";
import { createSystem } from "./system.ts";

export type ToWorker =
  | {
      type: "boot";
      wasmUrl: string;
      ctfUrl?: string;
      ctfAnswers?: string[];
      rows: number;
      cols: number;
      files?: Record<string, string>;
    }
  | { type: "input"; data: string }
  | { type: "resize"; rows: number; cols: number }
  | { type: "ack"; bytes: number }
  | { type: "ping" }
  | ({ type: "reply"; id: number } & ServiceReply);

export type FromWorker =
  | { type: "ready" }
  | { type: "output"; bytes: Uint8Array }
  | { type: "pong" }
  | { type: "error"; message: string }
  | { type: "request"; id: number; args: string[]; cols: number }
  | { type: "ctf-solved"; answer: string };

/** Above this much unacknowledged output, tty writes block (flow control). */
const HIGH_WATER = 64 * 1024;

const scope = self as unknown as DedicatedWorkerGlobalScope;
const send = (m: FromWorker, transfer: Transferable[] = []) => scope.postMessage(m, transfer);

let kernel: Kernel | undefined;
let ctf: Ctf | undefined;
let nextRequest = 1;
const replies = new Map<number, (r: ServiceReply) => void>();
let unacked = 0;
let pending: Uint8Array[] = [];
let pendingBytes = 0;
let flushQueued = false;

function flush() {
  flushQueued = false;
  if (!pendingBytes) return;
  const out = new Uint8Array(pendingBytes);
  let o = 0;
  for (const c of pending) {
    out.set(c, o);
    o += c.length;
  }
  pending = [];
  pendingBytes = 0;
  send({ type: "output", bytes: out }, [out.buffer]);
}

function output(bytes: Uint8Array) {
  pending.push(bytes.slice());
  pendingBytes += bytes.length;
  unacked += bytes.length;
  if (pendingBytes > 32 * 1024) flush();
  else if (!flushQueued) {
    flushQueued = true;
    queueMicrotask(flush);
  }
}

async function compile(url: string): Promise<WebAssembly.Module> {
  try {
    return await WebAssembly.compileStreaming(fetch(url));
  } catch {
    // Wrong MIME type from a dev or static server: compile from bytes.
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetching ${url}: HTTP ${res.status}`);
    return WebAssembly.compile(await res.arrayBuffer());
  }
}

async function fetchCtf(url: string | undefined) {
  if (!url) return undefined;
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return await loadCtf(bytes, (path, data, mode) => kernel?.vfs.writeFile(path, data, mode));
  } catch {
    return undefined; // the terminal works without the puzzles
  }
}

/** `fest ctf ...` is answered here; every other `fest` command by the page. */
async function request(args: string[]): Promise<ServiceReply> {
  const [color, cmd, ...rest] = args;
  if (cmd === "ctf") {
    if (!ctf) return { status: 1, body: "ctf: the puzzles could not be loaded\n" };
    const r = await ctf.command(rest, color === "1");
    if (r.solved) send({ type: "ctf-solved", answer: r.solved });
    return { status: r.status, body: r.body };
  }
  const id = nextRequest++;
  return new Promise((resolve) => {
    replies.set(id, resolve);
    send({ type: "request", id, args, cols: kernel?.tty.cols ?? 80 });
  });
}

async function boot(m: Extract<ToWorker, { type: "boot" }>) {
  const [module, puzzles] = await Promise.all([compile(m.wasmUrl), fetchCtf(m.ctfUrl)]);
  ctf = puzzles;
  kernel = createSystem({
    module,
    rows: m.rows,
    cols: m.cols,
    files: m.files,
    setup: (vfs) => {
      for (const [path, f] of Object.entries(ctf?.files ?? {})) vfs.writeFile(path, fileBytes(f), f.mode);
    },
    host: { output, outputReady: () => unacked < HIGH_WATER, request },
    onLogout: () => {
      output(new TextEncoder().encode("\r\n[session ended, starting a new shell]\r\n\r\n"));
      return true;
    },
  });
  send({ type: "ready" });
  // Puzzles solved in earlier visits: open their stages again.
  for (const answer of m.ctfAnswers ?? []) await ctf?.submit(answer).catch(() => {});
}

scope.onmessage = (e: MessageEvent<ToWorker>) => {
  const m = e.data;
  switch (m.type) {
    case "boot":
      boot(m).catch((err) => send({ type: "error", message: String(err?.message ?? err) }));
      break;
    case "input":
      kernel?.tty.input(m.data);
      break;
    case "resize":
      kernel?.tty.resize(m.rows, m.cols);
      break;
    case "ack":
      unacked = Math.max(0, unacked - m.bytes);
      kernel?.wake();
      break;
    case "ping":
      send({ type: "pong" });
      break;
    case "reply": {
      const resolve = replies.get(m.id);
      replies.delete(m.id);
      resolve?.({ status: m.status, body: m.body });
      break;
    }
  }
};
