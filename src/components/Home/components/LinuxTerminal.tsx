import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiArrowPath, HiXMark } from "react-icons/hi2";
import type { TerminalSession } from "../../../linux/client";
import { loadClient } from "../../../linux/load";

type State = "loading" | "booting" | "running" | "error";

interface Props {
  open: boolean;
  onClose: () => void;
}

const KEYS: [string, string][] = [
  ["Esc", "\x1b"],
  ["Tab", "\t"],
  ["^C", "\x03"],
  ["^D", "\x04"],
  ["↑", "\x1b[A"],
  ["↓", "\x1b[B"],
  ["←", "\x1b[D"],
  ["→", "\x1b[C"],
];

/**
 * A real BusyBox shell in a window. Mounted on first open and kept alive
 * afterwards, so closing and reopening keeps the session.
 */
const LinuxTerminal = ({ open, onClose }: Props) => {
  const screen = useRef<HTMLDivElement>(null);
  const session = useRef<TerminalSession>();
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState("");
  const [touch] = useState(() => matchMedia("(pointer: coarse)").matches);

  useEffect(() => {
    let cancelled = false;
    loadClient()
      .then(({ startTerminal }) => {
        if (cancelled || !screen.current) return;
        session.current = startTerminal(screen.current, {
          onState: (s, message) => {
            setState(s);
            if (message) setError(message);
          },
        });
      })
      .catch((e) => {
        setState("error");
        setError(String(e?.message ?? e));
      });
    return () => {
      cancelled = true;
      session.current?.dispose();
      session.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("linux-terminal-open");
    session.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.body.classList.remove("linux-terminal-open");
      prev?.focus?.();
    };
  }, [open]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] items-center justify-center bg-[#020617b3] md:p-6 ${open ? "flex" : "hidden"}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ترمینال لینوکس"
        dir="ltr"
        className="flex h-dvh w-full flex-col border-[#d6e7fc] bg-[#081a40] text-[#eaf5ff] shadow-[-12px_15px_24px_rgba(0,0,0,.35)] md:h-[min(40rem,85vh)] md:max-w-5xl md:border"
      >
        <div className="flex items-center gap-3 border-b border-[#d6e7fc33] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden="true">
            <i className="size-2.5 rounded-full border border-secondary bg-secondary" />
            <i className="size-2.5 rounded-full border border-indigo" />
            <i className="size-2.5 rounded-full border border-indigo" />
          </div>
          <p className="m-0 flex-1 truncate text-center font-mono text-sm">root@linuxfest: ~</p>
          <button
            type="button"
            onClick={() => session.current?.restart()}
            className="rounded p-1 text-[#eaf5ff] hover:bg-[#ffffff1a] focus-visible:outline-2 focus-visible:outline-secondary"
            aria-label="راه‌اندازی دوباره"
            title="Restart"
          >
            <HiArrowPath className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#eaf5ff] hover:bg-[#ffffff1a] focus-visible:outline-2 focus-visible:outline-secondary"
            aria-label="بستن ترمینال"
            title="Close"
          >
            <HiXMark className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative min-h-0 flex-1 p-2">
          <div ref={screen} className="h-full w-full" />
          {state !== "running" && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-mono text-sm">
              {state === "error" ? (
                <div>
                  <p className="m-0 text-secondary">could not start the terminal</p>
                  <p className="mt-2 text-xs text-text-gray">{error}</p>
                </div>
              ) : (
                <p className="m-0">
                  booting linux
                  <span className="terminal-cursor text-secondary">_</span>
                </p>
              )}
            </div>
          )}
        </div>
        {touch && (
          <div className="flex gap-1 overflow-x-auto border-t border-[#d6e7fc33] px-2 py-1.5">
            {KEYS.map(([label, seq]) => (
              <button
                key={label}
                type="button"
                className="min-w-11 rounded border border-[#d6e7fc55] px-2 py-1.5 font-mono text-sm active:bg-[#ffffff22]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => session.current?.type(seq)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default LinuxTerminal;
