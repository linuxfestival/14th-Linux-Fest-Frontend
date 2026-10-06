/// <reference lib="webworker" />
// Web Worker entry: runs the kernel and every BusyBox process.
//
// in:  boot {wasmUrl, rows, cols, files}, input {data}, resize {rows, cols},
//      ack {bytes}, ping
// out: ready, output {bytes} (batched, transferred), pong, error {message}
import type { Kernel } from "./kernel/kernel.ts";
import { createSystem } from "./system.ts";

export type ToWorker =
  | { type: "boot"; wasmUrl: string; rows: number; cols: number; files?: Record<string, string> }
  | { type: "input"; data: string }
  | { type: "resize"; rows: number; cols: number }
  | { type: "ack"; bytes: number }
  | { type: "ping" };

export type FromWorker =
  | { type: "ready" }
  | { type: "output"; bytes: Uint8Array }
  | { type: "pong" }
  | { type: "error"; message: string };

/** Above this much unacknowledged output, tty writes block (flow control). */
const HIGH_WATER = 64 * 1024;

const scope = self as unknown as DedicatedWorkerGlobalScope;
const send = (m: FromWorker, transfer: Transferable[] = []) => scope.postMessage(m, transfer);

let kernel: Kernel | undefined;
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

async function boot(m: Extract<ToWorker, { type: "boot" }>) {
  const module = await compile(m.wasmUrl);
  kernel = createSystem({
    module,
    rows: m.rows,
    cols: m.cols,
    files: m.files,
    host: { output, outputReady: () => unacked < HIGH_WATER },
    onLogout: () => {
      output(new TextEncoder().encode("\r\n[session ended, starting a new shell]\r\n\r\n"));
      return true;
    },
  });
  send({ type: "ready" });
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
  }
};
