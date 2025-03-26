import React, {useCallback, useEffect, useState} from "react";
import {cartActions, CartPage} from "../../../../core/cart/cart.slice";
import SelectableCard from "../components/SelectableCard";
import Button, {ButtonSizes, ButtonVariants} from "../../../Common/Button/Button";
import {useNavigate} from "react-router-dom";
import {finalizePaymentThunk} from "../../../../core/payment/payment.thunk.ts";
import InputField from "../../../Common/Button/Input.tsx";
import {RootState, useAppDispatch} from "../../../../store.ts";
import {toast} from "react-toastify";
import {FinalizePaymentResponse} from "../../../../core/payment/payment.dto.ts";
import {useSelector} from "react-redux";
import {getCouponStatusThunk} from "../../../../core/cart/cart.thunk.ts";

const CartPayment = () => {
    const [coupon, setCoupon] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {totalAmount, couponStatus, discountedAmount} = useSelector((root: RootState) => root.cart)

    useEffect(() => {
        dispatch(cartActions.setPage(CartPage.Checkout));
    }, [dispatch]);

    const takeAStepBackMortalAndThouShallBeForgiven = useCallback(() => {
        navigate("/profile/cart/list")
    }, [navigate])

    const applyCouponOnClick = () => {
        dispatch(getCouponStatusThunk(coupon))
            .then(result => {
                if (result.payload && getCouponStatusThunk.fulfilled.match(result)) {
                    if (result.payload.is_valid)
                        toast.success("کد تخفیف اعمال شد!")
                    else
                        toast.error("اعتبار کد تخفیف تمام شده است!")
                } else {
                    toast.error((result.payload as {
                        detail?: string
                    })?.detail ?? "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید.")
                }
            })
    }

    const dieInHonorOfMoney = useCallback(() => {
        dispatch(finalizePaymentThunk({
            coupon: couponStatus && couponStatus.is_valid ? coupon : ""
        }))
            .then(result => {
                if (finalizePaymentThunk.fulfilled.match(result)) {
                    if (result.payload.payment_url)
                        location.href = result.payload.payment_url
                    else
                        toast.error(result.payload?.detail ?? "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید.");
                } else {
                    const payload = result.payload as FinalizePaymentResponse
                    toast.error(payload.detail ?? "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید.");
                }
            })
    }, [coupon, couponStatus, dispatch])

    return (
        <>
            <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
                <h1 className="text-4xl font-bold mb-6 mt-4">محصول اضافه</h1>
                <div className="flex flex-wrap gap-4 items-center justify-center w-full px-4">
                    <SelectableCard
                        title="عنوان"
                        description="120 هزار تومان"
                        active={false}
                        image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
                        onClick={() => {
                        }}
                    />
                    <SelectableCard
                        title="عنوان"
                        description="120 هزار تومان"
                        active={false}
                        image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
                        onClick={() => {
                        }}
                    />
                    <SelectableCard
                        title="عنوان"
                        description="120 هزار تومان"
                        active={false}
                        image="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
                        onClick={() => {
                        }}
                    />
                </div>

                <h1 className="text-4xl font-bold mb-6 mt-12">روش های پرداخت</h1>
                <div className="flex flex-wrap gap-4 items-center justify-center w-full px-4">
                    <SelectableCard
                        title="پرداخت با زرین پال"
                        active={true}
                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Uj1aeKDQmxRlusgFJjEdbtg0ZwnN5XP0IA&s"
                        onClick={() => {
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center justify-start w-full px-4 max-w-[600px]">
                <div className="flex w-full">
                    <InputField
                        className="grow"
                        type={"text"}
                        value={coupon}
                        placeholder={"MinosPrime"}
                        label={"کد تخفیف؟"}
                        inputChangeHandler={e => setCoupon(e.target.value)}
                    />
                    <Button
                        className="mt-2.5 text-[1rem] max-w-4"
                        disabled={coupon === ""}
                        onClick={applyCouponOnClick}
                    >
                        اعمال
                    </Button>
                </div>
                {discountedAmount == null ? (
                    <div className="flex gap-1">
                        <p>مجموع قابل پرداخت:</p>
                        <p>{totalAmount}</p>
                        <p> تومان</p>
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <p>مجموع قابل پرداخت:</p>
                        <p className="line-through text-sm text-red-500">{totalAmount}</p>
                        <p className="text-green-500">{discountedAmount}</p>
                        <p> تومان</p>
                    </div>
                )}
                <div className="flex gap-2 w-full">
                    <Button onClick={takeAStepBackMortalAndThouShallBeForgiven} className="border-2"
                            variant={ButtonVariants.OUTLINE}>قبلی</Button>
                    <Button onClick={dieInHonorOfMoney}>پرداخت</Button>
                </div>
            </div>
        </>
    );
};

export default CartPayment;
