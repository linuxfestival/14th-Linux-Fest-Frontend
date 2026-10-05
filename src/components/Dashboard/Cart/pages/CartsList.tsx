import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import CartItem from "../components/CartItem";
import { useAppDispatch } from "../../../../store";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { selectCartState } from "../../../../core/cart/cart.selector";
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
  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Cart));
  }, [dispatch]);
  return (
    <DashboardPage
      title="سبد خرید"
      description="ارائه‌های انتخاب‌شده را بررسی کنید و سپس برای تکمیل خرید ادامه دهید."
    >
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
