import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";
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
  const { items, totalAmount, loading } = useSelector(selectCartState);
  const pending = items.filter((item) => item.payment_state !== "COMPLETED");
  const conflicts = findCartTimingConflicts(items);
  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
  }, [dispatch]);
  return (
    <DashboardPage
      title="سبد خرید"
      description="ارائه‌های انتخاب‌شده را بررسی کنید و سپس برای تکمیل خرید ادامه دهید."
    >
      {conflicts.length > 0 && (
        <section role="alert" aria-labelledby="cart-timing-conflicts" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800 sm:p-6">
          <div className="flex items-center gap-3">
            <HiExclamationTriangle aria-hidden="true" className="size-6 shrink-0" />
            <h2 id="cart-timing-conflicts" className="text-lg font-bold">تداخل زمانی ارائه‌ها</h2>
          </div>
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
        </section>
      )}
      {pending.length ? (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-4">
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
              <span>ارائه‌های انتخاب‌شده</span>
              <span>{priceText(pending.length)}</span>
            </div>
            <div className="mt-5 border-t border-primary/15 pt-5">
              <p className="text-sm text-dark-gray">مبلغ فعلی قابل پرداخت</p>
              <p className="mt-2 text-2xl font-black">
                {priceText(totalAmount)}{" "}
                <span className="text-xs font-normal">تومان</span>
              </p>
            </div>
            <Link
              aria-disabled={loading}
              tabIndex={loading ? -1 : undefined}
              onClick={(event) => {
                if (loading) event.preventDefault();
              }}
              to="/profile/cart/checkout"
              className={`${actionClass} mt-6 w-full ${loading ? "opacity-60" : ""}`}
            >
              تکمیل خرید
              <HiArrowLeft aria-hidden="true" className="size-4" />
            </Link>
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
    </DashboardPage>
  );
};
export default CartsList;
