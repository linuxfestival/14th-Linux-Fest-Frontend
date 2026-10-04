import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import type { PresenterCardProps } from "./PresenterCard";
import PresenterAvatar from "./PresenterAvatar";
import PresenterContacts from "./PresenterContacts";

const PresenterModal = ({ avatar, name, description, email, linkedin, onClose }: PresenterCardProps & { onClose: () => void }) => {
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
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl border-0 bg-white p-0 text-primary shadow-[0_24px_80px_rgba(11,13,49,0.3)] backdrop:bg-primary/70">
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <div className="relative shrink-0 bg-primary p-6 pt-16 text-white sm:p-8 sm:pt-16">
          <button ref={closeButton} type="button" aria-label="بستن اطلاعات ارائه‌دهنده" onClick={onClose} className="absolute left-3 top-3 flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"><HiXMark aria-hidden="true" className="size-6" /></button>
          <div className="flex items-center gap-4 sm:gap-5">
            <PresenterAvatar key={avatar} avatar={avatar} name={name} className="size-20 sm:size-24" />
            <h2 id={titleId} dir="auto" className="min-w-0 break-words text-2xl font-black leading-9 sm:text-3xl">{name}</h2>
          </div>
        </div>
        <div tabIndex={0} role="region" aria-label="زندگی‌نامه" className="min-h-0 overflow-y-auto overscroll-contain p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:p-8">
          <h3 className="mb-5 text-lg font-extrabold">درباره ارائه‌دهنده</h3>
          {description ? <div dir="auto" className="break-words text-sm leading-8 text-dark-gray sm:text-base [&_p+p]:mt-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:my-3 [&_h3]:font-bold [&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_a]:text-orange-ink [&_a]:underline [&_a]:underline-offset-4 [&_img]:h-auto [&_img]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto" dangerouslySetInnerHTML={{ __html: description }} /> : <p className="text-sm leading-8 text-dark-gray">زندگی‌نامه این ارائه‌دهنده هنوز منتشر نشده است.</p>}
          {(email?.trim() || linkedin?.trim()) && <div className="mt-7 border-t border-primary/15 pt-5"><PresenterContacts email={email} linkedin={linkedin} name={name} /></div>}
        </div>
      </div>
    </dialog>, document.body,
  );
};

export default PresenterModal;
