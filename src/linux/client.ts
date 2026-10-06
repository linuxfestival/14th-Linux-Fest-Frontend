// Main-thread side of the terminal: xterm.js, the worker, flow control and
// the watchdog. Loaded with import() when the terminal opens, so none of it
// (or xterm.js) is in the main bundle.
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./terminal.css";
import wasmUrl from "./busybox.wasm?url";
import type { FromWorker, ToWorker } from "./worker.ts";

/** How long the worker may stay silent after ^C before it is restarted. */
const WATCHDOG_MS = 2000;

export interface TerminalSession {
  focus(): void;
  /** Sends keys as if typed (for the touch toolbar). */
  type(data: string): void;
  restart(): void;
  dispose(): void;
}

export interface SessionOptions {
  onState?: (state: "booting" | "running" | "error", message?: string) => void;
}

/** Warms the HTTP cache with busybox.wasm (call on hover/focus of the launcher). */
export function prefetch() {
  if (document.querySelector(`link[data-busybox]`)) return;
  const l = document.createElement("link");
  l.rel = "prefetch";
  l.as = "fetch";
  l.crossOrigin = "anonymous";
  l.href = wasmUrl;
  l.dataset.busybox = "";
  document.head.appendChild(l);
}

export function startTerminal(container: HTMLElement, opts: SessionOptions = {}): TerminalSession {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const term = new Terminal({
    cursorBlink: !reduceMotion,
    fontFamily: '"DejaVu Sans Mono", "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace',
    fontSize: container.clientWidth < 500 ? 13 : 15,
    scrollback: 2000,
    allowProposedApi: false,
    theme: {
      background: "#081a40",
      foreground: "#eaf5ff",
      cursor: "#F7941D",
      cursorAccent: "#081a40",
      selectionBackground: "#7EC8F355",
      black: "#0B0D31",
      blue: "#7EC8F3",
      brightBlue: "#a8dcfa",
      yellow: "#F7941D",
      brightYellow: "#ffb859",
    },
  });
  const fit = new FitAddon();
  term.loadAddon(fit);
  term.open(container);
  fit.fit();

  let worker: Worker | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const post = (m: ToWorker) => worker?.postMessage(m);

  const boot = () => {
    opts.onState?.("booting");
    worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module", name: "busybox" });
    worker.onmessage = (e: MessageEvent<FromWorker>) => {
      const m = e.data;
      if (m.type === "output") {
        const n = m.bytes.length;
        term.write(m.bytes, () => post({ type: "ack", bytes: n }));
      } else if (m.type === "pong") {
        clearTimeout(watchdog);
        watchdog = undefined;
      } else if (m.type === "ready") {
        opts.onState?.("running");
      } else if (m.type === "error") {
        opts.onState?.("error", m.message);
      }
    };
    worker.onerror = (e) => {
      e.preventDefault();
      crash("the kernel stopped unexpectedly");
    };
    post({ type: "boot", wasmUrl: new URL(wasmUrl, location.href).href, rows: term.rows, cols: term.cols });
  };

  const stop = () => {
    clearTimeout(watchdog);
    watchdog = undefined;
    worker?.terminate();
    worker = undefined;
  };

  const crash = (why: string) => {
    if (disposed) return;
    stop();
    term.write(`\r\n\x1b[1;33m[${why}; restarting]\x1b[0m\r\n`);
    boot();
  };

  const restart = () => {
    stop();
    term.reset();
    boot();
  };

  term.onData((data) => {
    post({ type: "input", data });
    // ^C while a process spins without a yield point can't be delivered:
    // the worker never gets to read the message. Restart it if it's stuck.
    if (data.includes("\x03") && worker && !watchdog) {
      post({ type: "ping" });
      watchdog = setTimeout(() => crash("a process did not respond to ^C"), WATCHDOG_MS);
    }
  });
  term.onResize(({ rows, cols }) => post({ type: "resize", rows, cols }));

  // Ctrl+Shift+C / Ctrl+Shift+V copy and paste, as in Linux terminals.
  // preventDefault keeps the browser from opening its inspector on Ctrl+Shift+C.
  term.attachCustomKeyEventHandler((e) => {
    if (!e.ctrlKey || !e.shiftKey || e.altKey || e.metaKey) return true;
    if (e.code !== "KeyC" && e.code !== "KeyV") return true;
    e.preventDefault();
    if (e.type !== "keydown") return false;
    if (e.code === "KeyC") {
      const selection = term.getSelection();
      if (selection) navigator.clipboard?.writeText(selection).catch(() => {});
    } else {
      navigator.clipboard
        ?.readText()
        .then((text) => text && term.paste(text))
        .catch(() => {});
    }
    return false;
  });

  const ro = new ResizeObserver(() => {
    // Closing the window hides it (display: none). Fitting then would shrink
    // the terminal to a few columns and the shell would redraw its prompt
    // for that width, so keep the old size until it is visible again.
    if (!container.clientWidth || !container.clientHeight) return;
    try {
      fit.fit();
    } catch {
      // container hidden
    }
  });
  ro.observe(container);

  boot();
  term.focus();

  return {
    focus: () => term.focus(),
    type: (data) => {
      term.focus();
      term.input(data, true);
    },
    restart,
    dispose() {
      disposed = true;
      ro.disconnect();
      stop();
      term.dispose();
    },
  };
}
