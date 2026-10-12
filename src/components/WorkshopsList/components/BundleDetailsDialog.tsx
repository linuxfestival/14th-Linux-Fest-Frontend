import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { ToastContainer } from "react-toastify";
const BundleDetailsDialog = ({ name, onClose, children }: { name: string; onClose: () => void; children: ReactNode }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const backdropStarted = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  const outside = (x: number, y: number) => {
    const bounds = dialog.current?.getBoundingClientRect();
    return !!bounds && (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom);
  };

  return createPortal(
    <dialog ref={dialog} dir="rtl" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onPointerDown={event => { backdropStarted.current = outside(event.clientX, event.clientY); }}
      onClick={event => { if (backdropStarted.current && outside(event.clientX, event.clientY)) onClose(); }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') || []).filter(element => element.getClientRects().length);
        const first = controls[0]; const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-xl border-0 bg-white p-0 text-primary shadow-[0_24px_80px_rgba(11,13,49,0.3)] backdrop:bg-primary/70">
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <div className="relative shrink-0 bg-primary p-6 pt-16 text-white sm:p-8 sm:pt-16">
          <button ref={closeButton} type="button" aria-label="بستن جزئیات بسته" onClick={onClose} className="absolute left-3 top-3 flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"><HiXMark aria-hidden="true" className="size-6" /></button>
          <h2 id={titleId} dir="auto" className="break-words text-2xl font-black leading-9">{name}</h2>
        </div>
        <div tabIndex={0} role="region" aria-label="محتوا و زمان‌بندی بسته" className="min-h-0 overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary">
          {children}
        </div>
        <ToastContainer
          containerId="bundle-details"
          rtl
          theme="colored"
          hideProgressBar
          closeOnClick
          position="bottom-center"
          limit={1}
          style={{
            position: "absolute",
            insetInline: "1rem",
            bottom: "1rem",
            width: "auto",
            transform: "none",
          }}
        />
      </div>
    </dialog>, document.body,
  );
};

export default BundleDetailsDialog;
