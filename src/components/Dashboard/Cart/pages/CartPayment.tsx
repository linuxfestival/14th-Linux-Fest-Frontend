import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiCreditCard } from "react-icons/hi2";
import { type RootState, useAppDispatch } from "../../../../store";
import { cartActions, CartPage } from "../../../../core/cart/cart.slice";
import { selectCartState } from "../../../../core/cart/cart.selector";
import {
  getAccessoriesListThunk,
  getCouponStatusThunk,
} from "../../../../core/cart/cart.thunk";
import { finalizePaymentThunk } from "../../../../core/payment/payment.thunk";
import AuthField from "../../../Auth/AuthField";
import SelectableCard from "../components/SelectableCard";
import {
  DashboardButton,
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
} from "../../DashboardUI";
import { priceText, secondaryActionClass } from "../../dashboard.styles";
const CartPayment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [accessoryError, setAccessoryError] = useState(false);
  const {
    items,
    totalAmount,
    couponStatus,
    discountedAmount,
    accessoryLoading,
    accessoryList,
    selectedAccessories,
  } = useSelector(selectCartState);
  const user = useSelector((state: RootState) => state.users.user);
  const paymentLoading = useSelector(
    (state: RootState) => state.payment.loading,
  );
  const loadAccessories = () => {
    setAccessoryError(false);
    void dispatch(getAccessoriesListThunk()).then((result) =>
      setAccessoryError(!getAccessoriesListThunk.fulfilled.match(result)),
    );
  };
  useEffect(() => {
    dispatch(cartActions.setPage(CartPage.Checkout));
    void dispatch(getAccessoriesListThunk()).then((result) =>
      setAccessoryError(!getAccessoriesListThunk.fulfilled.match(result)),
    );
  }, [dispatch]);
  const available = accessoryList.filter(
    (item) =>
      item.is_active &&
      !user?.accessories.some((owned) => owned.id === item.id),
  );
  const hasDiscount =
    !!appliedCoupon && couponStatus?.is_valid && discountedAmount !== undefined;
  const pending = items.filter((item) => item.payment_state !== "COMPLETED");
  const applyCoupon = async () => {
    if (!coupon.trim() || couponLoading || paymentLoading) return;
    setCouponLoading(true);
    setCouponError("");
    const value = coupon.trim();
    const result = await dispatch(getCouponStatusThunk(value));
    if (
      getCouponStatusThunk.fulfilled.match(result) &&
      result.payload?.is_valid
    ) {
      setAppliedCoupon(value);
      toast.success("کد تخفیف اعمال شد.");
    } else {
      setAppliedCoupon("");
      setCouponError(
        "کد تخفیف معتبر نیست یا دریافت آن ناموفق بود. دوباره بررسی کنید.",
      );
    }
    setCouponLoading(false);
  };
  const pay = async () => {
    if (
      paymentLoading ||
      couponLoading ||
      accessoryLoading ||
      !user ||
      (!pending.length && !selectedAccessories.length)
    )
      return;
    setPaymentError("");
    const result = await dispatch(
      finalizePaymentThunk({
        coupon: hasDiscount ? appliedCoupon : "",
        accessories: selectedAccessories,
      }),
    );
    if (finalizePaymentThunk.fulfilled.match(result)) {
      if (result.payload.data?.payment_url)
        window.location.assign(result.payload.data.payment_url);
      else if (result.payload.status === 204) {
        toast.success("پرداخت با موفقیت انجام شد.");
        navigate("/profile/workshops");
      } else
        setPaymentError(
          result.payload.data?.detail || "پرداخت انجام نشد. دوباره تلاش کنید.",
        );
    } else {
      const payload = result.payload as { detail?: string } | undefined;
      setPaymentError(payload?.detail || "پرداخت انجام نشد. دوباره تلاش کنید.");
    }
  };
  return (
    <DashboardPage
      title="تکمیل خرید"
      description="محصولات اختیاری، کد تخفیف و مبلغ نهایی را پیش از پرداخت بررسی کنید."
    >
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-6">
          <DashboardPanel>
            <h2 className="text-lg font-bold">محصولات اختیاری</h2>
            <p className="mt-2 text-sm leading-7 text-dark-gray">
              در صورت تمایل، محصولات زیر را به خریدتان اضافه کنید.
            </p>
            <fieldset disabled={paymentLoading} className="mt-5 space-y-3">
              {accessoryLoading ? (
                <DashboardLoading text="در حال دریافت محصولات…" />
              ) : accessoryError ? (
                <>
                  <p role="alert" className="text-sm text-ubuntu-red">
                    دریافت محصولات ناموفق بود.
                  </p>
                  <button
                    type="button"
                    className={secondaryActionClass}
                    onClick={loadAccessories}
                  >
                    تلاش دوباره
                  </button>
                </>
              ) : available.length ? (
                available.map((item) => (
                  <SelectableCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    image={item.img}
                    price={item.price}
                    active={selectedAccessories.includes(item.id)}
                    onClick={() =>
                      dispatch(
                        selectedAccessories.includes(item.id)
                          ? cartActions.removeAccessory(item.id)
                          : cartActions.addAccessory(item.id),
                      )
                    }
                  />
                ))
              ) : (
                <p className="text-sm leading-7 text-dark-gray">
                  محصول اضافه‌ای برای انتخاب در دسترس نیست.
                </p>
              )}
            </fieldset>
          </DashboardPanel>
          <DashboardPanel>
            <h2 className="text-lg font-bold">روش پرداخت</h2>
            <div className="mt-5 flex items-center gap-4 rounded-lg border border-secondary bg-secondary/10 p-4">
              <HiCreditCard aria-hidden="true" className="size-6" />
              <div>
                <p className="text-sm font-bold">درگاه زرین‌پال</p>
                <p className="mt-1 text-xs leading-6 text-dark-gray">
                  برای پرداخت به درگاه هدایت می‌شوید.
                </p>
              </div>
            </div>
          </DashboardPanel>
        </div>
        <DashboardPanel className="xl:sticky xl:top-28">
          <h2 className="text-lg font-bold">خلاصه پرداخت</h2>
          <dl className="mt-5 space-y-3 text-sm text-dark-gray">
            <div className="flex justify-between gap-3">
              <dt>ارائه‌ها</dt>
              <dd>{priceText(pending.length)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>محصولات اضافه</dt>
              <dd>{priceText(selectedAccessories.length)}</dd>
            </div>
          </dl>
          <form
            className="mt-6 border-t border-primary/15 pt-5"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void applyCoupon();
            }}
          >
            <fieldset disabled={couponLoading || paymentLoading}>
              <AuthField
                label="کد تخفیف"
                name="coupon"
                value={coupon}
                onChange={(event) => {
                  setCoupon(event.target.value);
                  setCouponError("");
                }}
                direction="ltr"
                placeholder="کد را وارد کنید"
                errorText={couponError}
              />
              <button
                type="submit"
                disabled={!coupon.trim()}
                className={`${secondaryActionClass} mt-3 w-full`}
              >
                {couponLoading ? "در حال بررسی…" : "اعمال کد تخفیف"}
              </button>
            </fieldset>
            {hasDiscount && (
              <p
                role="status"
                className="mt-3 break-all text-xs leading-6 text-green-800"
              >
                کد {appliedCoupon} اعمال شده است.
              </p>
            )}
          </form>
          <div className="mt-6 border-t border-primary/15 pt-5">
            <p className="text-sm text-dark-gray">مبلغ نهایی</p>
            {hasDiscount && (
              <p className="mt-2 text-sm text-dark-gray line-through">
                {priceText(totalAmount)} تومان
              </p>
            )}
            <p className="mt-2 text-2xl font-black">
              {priceText(hasDiscount ? discountedAmount! : totalAmount)}{" "}
              <span className="text-xs font-normal">تومان</span>
            </p>
          </div>
          {paymentError && (
            <p role="alert" className="mt-4 text-sm leading-7 text-ubuntu-red">
              {paymentError}
            </p>
          )}
          <DashboardButton
            type="button"
            onClick={() => void pay()}
            loading={paymentLoading}
            disabled={
              couponLoading ||
              accessoryLoading ||
              !user ||
              (!pending.length && !selectedAccessories.length)
            }
            className="mt-6 w-full"
          >
            پرداخت و تکمیل خرید
          </DashboardButton>
          <Link
            to="/profile/cart/list"
            className={`${secondaryActionClass} mt-3 w-full`}
          >
            بازگشت به سبد خرید
          </Link>
        </DashboardPanel>
      </div>
    </DashboardPage>
  );
};
export default CartPayment;
