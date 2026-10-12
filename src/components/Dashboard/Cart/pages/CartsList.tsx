import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";
import BundleCard from "../../../WorkshopsList/components/BundleCard";
import BundleSuggestionModal from "../components/BundleSuggestionModal";
import { standaloneCartItems } from "../../../../core/cart/cart.pricing";
import { getCartThunk } from "../../../../core/cart/cart.thunk";
import { getBundles } from "../../../../core/bundles/bundles.api";
import type { BundleDto } from "../../../../core/bundles/bundles.types";
import CartItem from "../components/CartItem";
import { useAppDispatch } from "../../../../store";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { selectCartState } from "../../../../core/cart/cart.selector";
import { findCartTimingConflicts } from "../../../../core/cart/cart.conflicts";
import {
  DashboardEmpty,
  DashboardPage,
  DashboardPanel,
} from "../../DashboardUI";
import { actionClass, dateText, priceText } from "../../dashboard.styles";
const CartsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showConflicts, setShowConflicts] = useState(false);
  const [showBundleSuggestions, setShowBundleSuggestions] = useState(false);
  const [bundleCatalog, setBundleCatalog] = useState<BundleDto[]>([]);
  const [bundleCatalogChecked, setBundleCatalogChecked] = useState(false);
  const [checkoutRequested, setCheckoutRequested] = useState(false);
  const { items, bundles, totalAmount, loading, error } = useSelector(selectCartState);
  const pending = standaloneCartItems(items);
  const conflicts = findCartTimingConflicts(items);
  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
  }, [dispatch]);
  useEffect(() => {
    let active = true;
    let settled = false;
    const fallback = window.setTimeout(() => {
      if (active && !settled) setBundleCatalogChecked(true);
    }, 1500);
    getBundles()
      .then((response) => { if (active) setBundleCatalog(response.data); })
      .catch(() => { /* A catalog failure must not block checkout. */ })
      .finally(() => {
        settled = true;
        window.clearTimeout(fallback);
        if (active) setBundleCatalogChecked(true);
      });
    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, []);
  const suggestions = useMemo(() => {
    const selectedBundleIds = new Set(bundles.map((selection) => selection.bundle.id));
    const pendingPresentationIds = new Set(pending.map((item) => item.presentation.id));
    return bundleCatalog.filter((bundle) =>
      bundle.is_available &&
      !selectedBundleIds.has(bundle.id) &&
      bundle.presentations.some((presentation) => pendingPresentationIds.has(presentation.id)),
    );
  }, [bundleCatalog, bundles, pending]);
  const continueToCheckout = useCallback(() => navigate("/profile/cart/checkout"), [navigate]);
  useEffect(() => {
    if (!checkoutRequested || !bundleCatalogChecked) return;
    setCheckoutRequested(false);
    if (suggestions.length) setShowBundleSuggestions(true);
    else continueToCheckout();
  }, [bundleCatalogChecked, checkoutRequested, continueToCheckout, suggestions]);
  const startCheckout = () => {
    if (loading || error) return;
    setCheckoutRequested(true);
  };
  return (
    <DashboardPage
      title="سبد خرید"
      description="ارائه‌های انتخاب‌شده را بررسی کنید و سپس برای تکمیل خرید ادامه دهید."
    >
      {error && <div role="alert" className="text-sm leading-7 text-ubuntu-red">دریافت سبد خرید ناموفق بود. برای بررسی مبلغ، دوباره تلاش کنید.
        <button type="button" disabled={loading} onClick={() => dispatch(getCartThunk())} className="ms-3 min-h-11 rounded-lg px-3 underline">دریافت دوباره سبد خرید</button>
      </div>}
      {conflicts.length > 0 && (
        <section role="alert" aria-labelledby="cart-timing-conflicts" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <HiExclamationTriangle aria-hidden="true" className="size-6 shrink-0" />
              <h2 id="cart-timing-conflicts" className="text-lg font-bold">تداخل زمانی ارائه‌ها</h2>
            </div>
            <button
              type="button"
              aria-expanded={showConflicts}
              aria-controls="cart-timing-conflict-details"
              onClick={() => setShowConflicts((shown) => !shown)}
              className="min-h-11 rounded-lg px-3 py-2 text-sm font-bold underline underline-offset-4 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              {showConflicts ? "بستن تداخل‌ها" : "نمایش تداخل‌ها"}
            </button>
          </div>
          <div id="cart-timing-conflict-details" hidden={!showConflicts}>
            <p className="mt-3 text-sm leading-7">زمان بعضی از ارائه‌های انتخاب‌شده با هم یا با ارائه‌های خریداری‌شده‌تان تداخل دارد. پیش از تکمیل خرید، زمان آن‌ها را بررسی کنید.</p>
            <ul className="mt-4 space-y-4">
            {conflicts.map(({ selected, other, start, end }) => (
              <li key={`${selected.presentation.id}-${other.presentation.id}`} className="text-sm leading-7">
                <p>
                  <strong dir="auto">{selected.presentation.fa_title || selected.presentation.en_title}</strong>
                  {" با "}
                  <strong dir="auto">{other.presentation.fa_title || other.presentation.en_title}</strong>
                  {other.payment_state === "COMPLETED" ? " (خریداری‌شده)" : " (در سبد خرید)"}
                </p>
                <p className="mt-1">زمان مشترک: {dateText(start)} تا {dateText(end)}</p>
              </li>
            ))}
            </ul>
          </div>
        </section>
      )}
      {pending.length || bundles.length ? (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-4">
            {bundles.map(selection => <BundleCard key={selection.id} bundle={selection.bundle} cart />)}
            {pending.map(({ id, presentation }) => (
              <CartItem
                key={id}
                id={presentation.id}
                title={presentation.fa_title || presentation.en_title}
                image={presentation.morkopoloyor}
                price={presentation.cost}
                currency="تومان"
                instructor={presentation.presenters
                  .map(
                    (presenter) =>
                      `${presenter.first_name} ${presenter.last_name}`,
                  )
                  .join(" و ")}
                dateTime={dateText(presentation.start)}
              />
            ))}
          </div>
          <DashboardPanel className="xl:sticky xl:top-28">
            <h2 className="text-lg font-bold">خلاصه خرید</h2>
            <div className="mt-5 flex justify-between gap-3 text-sm text-dark-gray">
              <span>محصولات انتخاب‌شده</span>
              <span>{priceText(pending.length + bundles.length)}</span>
            </div>
            <div className="mt-5 border-t border-primary/15 pt-5">
              <p className="text-sm text-dark-gray">مبلغ فعلی قابل پرداخت</p>
              <p className="mt-2 text-2xl font-black">
                {priceText(totalAmount)}{" "}
                <span className="text-xs font-normal">تومان</span>
              </p>
            </div>
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading || error || checkoutRequested}
              className={`${actionClass} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {checkoutRequested ? "در حال بررسی بسته‌ها…" : "تکمیل خرید"}
              <HiArrowLeft aria-hidden="true" className="size-4" />
            </button>
          </DashboardPanel>
        </div>
      ) : (
        <DashboardPanel>
          <DashboardEmpty
            title="سبد خرید شما خالی است"
            description="کارگاه‌ها و ارائه‌های جشنواره را ببینید و ارائه دلخواهتان را به سبد اضافه کنید."
          />
        </DashboardPanel>
      )}
      {showBundleSuggestions && <BundleSuggestionModal bundles={suggestions} onClose={() => setShowBundleSuggestions(false)} onContinue={continueToCheckout} />}
    </DashboardPage>
  );
};
export default CartsList;
