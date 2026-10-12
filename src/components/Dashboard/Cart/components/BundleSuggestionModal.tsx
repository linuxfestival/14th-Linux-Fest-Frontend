import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiXMark } from "react-icons/hi2";
import type { BundleDto } from "../../../../core/bundles/bundles.types";
import { addBundleToCartThunk } from "../../../../core/cart/cart.thunk";
import { useAppDispatch } from "../../../../store";
import {
  actionClass,
  priceText,
  secondaryActionClass,
} from "../../dashboard.styles";

const bundleContentsText = (bundle: BundleDto) => {
  const [first] = bundle.presentations;
  const title = first?.fa_title || first?.en_title;
  if (!title) return "جزئیات ارائه‌های این بسته";
  const remaining = bundle.presentations.length - 1;
  return remaining > 0
    ? `شامل «${title}» و ${new Intl.NumberFormat("fa-IR").format(remaining)} ارائه دیگر`
    : `شامل «${title}»`;
};

const BundleSuggestionModal = ({
  bundles,
  onClose,
  onContinue,
}: {
  bundles: BundleDto[];
  onClose: () => void;
  onContinue: () => void;
}) => {
  const dispatch = useAppDispatch();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [adding, setAdding] = useState<number | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
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

  const addAndContinue = async (bundleId: number) => {
    if (adding !== null) return;
    setAdding(bundleId);
    const result = await dispatch(addBundleToCartThunk(bundleId));
    setAdding(null);
    if (addBundleToCartThunk.fulfilled.match(result)) onContinue();
  };
  const requestClose = () => {
    if (adding === null) onClose();
  };

  return createPortal(
    <dialog
      ref={dialog}
      dir="rtl"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-xl border-0 bg-white p-0 text-primary shadow-[0_24px_80px_rgba(11,13,49,0.3)] backdrop:bg-primary/70"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="relative shrink-0 border-b border-primary/15 px-6 pb-5 pt-16 sm:px-8">
          <button
            ref={closeButton}
            type="button"
            aria-label="بستن پیشنهاد بسته"
            onClick={requestClose}
            disabled={adding !== null}
            className="absolute left-3 top-3 flex size-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiXMark aria-hidden="true" className="size-6" />
          </button>
          <h2 id={titleId} className="text-xl font-black leading-8 sm:text-2xl">
            چند ارائه رو یک‌جا می‌خوای؟
          </h2>
          <p
            id={descriptionId}
            className="mt-2 max-w-xl text-sm leading-7 text-dark-gray"
          >
            یکی از ارائه‌های انتخابی‌ات داخل این بسته‌هاست. قبل از پرداخت،
            انتخابت رو ببین.
          </p>
        </header>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-6 py-2 sm:px-8">
          <ul className="divide-y divide-primary/15">
            {bundles.map((bundle) => {
              return (
                <li key={bundle.id} className="py-6 first:pt-5">
                  <h3 dir="auto" className="break-words text-lg font-extrabold">
                    {bundle.name}
                  </h3>
                  <p
                    dir="auto"
                    className="mt-2 text-sm leading-7 text-dark-gray"
                  >
                    {bundleContentsText(bundle)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-lg font-black tabular-nums">
                      {priceText(bundle.price)}{" "}
                      <span className="text-xs font-normal text-dark-gray">
                        تومان
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => void addAndContinue(bundle.id)}
                      disabled={adding !== null}
                      aria-busy={adding === bundle.id}
                      aria-label={`افزودن بسته ${bundle.name} و ادامه خرید`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-dark-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {adding === bundle.id
                        ? "در حال افزودن…"
                        : "افزودن بسته و ادامه"}
                      <HiArrowLeft aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <footer className="shrink-0 border-t border-primary/15 bg-indigo/10 px-6 py-4 sm:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onContinue}
              disabled={adding !== null}
              className={`${actionClass} w-full disabled:opacity-50`}
            >
              ادامه بدون بسته
              <HiArrowLeft aria-hidden="true" className="size-4" />
            </button>
            <Link
              to="/workshops?format=bundles"
              onClick={(event) => {
                if (adding !== null) event.preventDefault();
                else onClose();
              }}
              aria-disabled={adding !== null}
              tabIndex={adding !== null ? -1 : undefined}
              className={`${secondaryActionClass} w-full border-indigo/60 bg-white text-orange-ink hover:bg-secondary/10 ${adding !== null ? "pointer-events-none opacity-50" : ""}`}
            >
              دیدن همه بسته‌ها
              <HiArrowLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
};

export default BundleSuggestionModal;
