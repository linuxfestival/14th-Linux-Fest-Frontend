import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAppDispatch } from "../../../store";
import { selectIsAuthenticated } from "../../../core/auth/auth.selector";
import { selectCartState } from "../../../core/cart/cart.selector";
import { addBundleToCartThunk, removeBundleFromCartThunk, getCartThunk } from "../../../core/cart/cart.thunk";
import { bundleAvailabilityText, type BundleDto } from "../../../core/bundles/bundles.types";
import { priceText, dateText } from "../../Dashboard/dashboard.styles";
import { HiArrowLeft, HiCommandLine, HiMicrophone } from "react-icons/hi2";
import { PresentationService } from "../../../core/presentations/presentations.dto";
import PresentationTags from "./PresentationTags";

const BundleCard = ({ bundle, cart = false, onChanged }: { bundle: BundleDto; cart?: boolean; onChanged?: () => void }) => {
  const dispatch = useAppDispatch();
  const authenticated = useSelector(selectIsAuthenticated);
  const { bundles, loading, error } = useSelector(selectCartState);
  const selected = cart || bundles.some(selection => selection.bundle.id === bundle.id);
  const [pending, setPending] = useState(false);
  const update = async () => {
    if (pending || loading || error) return;
    if (!authenticated) {
      toast.info("برای افزودن بسته به سبد خرید، وارد حساب کاربری شوید.");
      return;
    }
    setPending(true);
    try {
      const result = await dispatch(selected ? removeBundleFromCartThunk(bundle.id) : addBundleToCartThunk(bundle.id));
      if (result.meta.requestStatus === "fulfilled") onChanged?.();
    } finally { setPending(false); }
  };

  const savings = Math.max(0, Number(bundle.original_price) - Number(bundle.price));

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-white text-primary">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 dir="auto" className="break-words text-2xl font-black leading-snug sm:text-3xl">{bundle.name}</h3>
            {selected && <span className="text-sm font-bold text-success">در سبد خرید شما</span>}
          </div>
          {bundle.description && <p dir="auto" className="mt-3 max-w-2xl whitespace-pre-line break-words text-sm leading-7 text-dark-gray">{bundle.description}</p>}
          {bundle.tags.length > 0 && <div className="mt-4"><PresentationTags tags={bundle.tags.map(tag => tag.fa_name || tag.name || tag.en_name || "").filter(Boolean)} /></div>}
          <h4 className="mt-7 flex flex-wrap items-center gap-2 border-b border-primary/15 pb-3 text-sm font-extrabold">
            برنامه‌های این بسته
            <span className="font-normal text-dark-gray">({priceText(bundle.presentations.length)} برنامه)</span>
          </h4>
          <ul className="divide-y divide-primary/10">
            {bundle.presentations.map(presentation => {
              const workshop = presentation.service_type === PresentationService.WORKSHOP;
              const Icon = workshop ? HiCommandLine : HiMicrophone;
              const type = workshop ? "کارگاه" : presentation.service_type === PresentationService.TALK ? "ارائه" : "برنامه";
              return (
                <li key={presentation.id}>
                  <Link to={`/workshop/${presentation.id}`} className="group flex min-h-16 items-start gap-3 rounded-lg py-4 transition-colors hover:bg-indigo/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-4">
                    <Icon aria-hidden="true" className={`mt-1 size-5 shrink-0 ${workshop ? "text-orange-ink" : "text-dark-gray"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span dir="auto" className="break-words text-base font-extrabold leading-7">{presentation.fa_title || presentation.en_title}</span>
                        <span className="text-xs font-bold text-dark-gray">{type}</span>
                      </div>
                      <span className="mt-1 block text-xs leading-6 text-dark-gray">{dateText(presentation.start)} تا {dateText(presentation.end)}</span>
                    </div>
                    <HiArrowLeft aria-hidden="true" className="mt-1 size-4 shrink-0 text-dark-gray transition-transform motion-safe:group-hover:-translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col justify-center bg-primary p-5 text-white sm:p-8">
          <p className="text-sm font-bold text-text-gray">قیمت کل بسته</p>
          <p className="mt-3 text-3xl font-black tabular-nums sm:text-4xl">{Number(bundle.price) === 0 ? "رایگان" : <>{priceText(bundle.price)} <span className="text-sm font-normal">تومان</span></>}</p>
          {savings > 0 && <div className="mt-4 border-t border-white/15 pt-4">
            <p className="text-xs leading-6 text-text-gray">خرید جداگانه: <s>{priceText(bundle.original_price)} تومان</s></p>
            <p className="mt-2 text-sm font-extrabold leading-7 text-secondary">{priceText(savings)} تومان کمتر از خرید جداگانه</p>
          </div>}
          <p className="mt-5 text-sm font-bold leading-7 text-text-gray">{selected ? "همهٔ برنامه‌های بسته در سبد خرید شماست" : bundleAvailabilityText(bundle)}</p>
          <button type="button" onClick={() => void update()} disabled={pending || loading || error || (!selected && !bundle.is_available)} aria-busy={pending} className="mt-5 min-h-12 w-full rounded-lg bg-secondary px-4 py-3 text-sm font-extrabold text-primary transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-text-gray">
            {pending ? "در حال به‌روزرسانی…" : selected ? "حذف کل بسته از سبد خرید" : !bundle.is_available ? "ثبت‌نام در دسترس نیست" : "افزودن بسته به سبد خرید"}
          </button>
          {error && <button type="button" onClick={() => dispatch(getCartThunk())} disabled={loading} className="mt-3 min-h-11 rounded-lg text-sm underline focus-visible:outline-2 focus-visible:outline-secondary">دریافت دوباره سبد خرید</button>}
          {selected && !cart && <Link to="/profile/cart/list" className="mt-3 flex min-h-11 items-center justify-center rounded-lg text-sm font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-secondary">مشاهده سبد خرید</Link>}
          {!authenticated && bundle.is_available && <Link to="/login" className="mt-3 flex min-h-11 items-center justify-center rounded-lg text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-secondary">ورود برای خرید</Link>}
        </div>
      </div>
    </article>
  );
};

export default BundleCard;
