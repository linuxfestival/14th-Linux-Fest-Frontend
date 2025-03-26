import React, {useCallback, useEffect, useMemo, useState} from "react";
import {cartActions, CartPage} from "../../../../core/cart/cart.slice";
import SelectableCard from "../components/SelectableCard";
import Button, {ButtonVariants,} from "../../../Common/Button/Button";
import {useNavigate} from "react-router-dom";
import {finalizePaymentThunk} from "../../../../core/payment/payment.thunk.ts";
import InputField from "../../../Common/Button/Input.tsx";
import {RootState, useAppDispatch} from "../../../../store.ts";
import {toast} from "react-toastify";
import {FinalizePaymentResponse} from "../../../../core/payment/payment.dto.ts";
import {useSelector} from "react-redux";
import {getAccessoriesListThunk, getCouponStatusThunk,} from "../../../../core/cart/cart.thunk.ts";
import {selectCartState} from "../../../../core/cart/cart.selector.ts";
import Skeleton from "../../../Skeleton/Skeleton.tsx";
import {AccessoryDto} from "../../../../core/cart/cart.api.ts";
import digitsToPersian from "../../../../utils/digitsToPersian.ts";
import {IoCloseCircleSharp} from "react-icons/io5";

const CartPayment = () => {
    const [coupon, setCoupon] = useState("");
    const [showCouponModal, setShowCouponModal] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        totalAmount,
        couponStatus,
        discountedAmount,
        accessoryLoading,
        accessoryList,
        selectedAccessories,
    } = useSelector(selectCartState);

    const {user} = useSelector((root: RootState) => root.users);

    useEffect(() => {
        dispatch(cartActions.setPage(CartPage.Checkout));
        dispatch(getAccessoriesListThunk());
    }, [dispatch]);

    const takeAStepBackMortalAndThouShallBeForgiven = useCallback(() => {
        navigate("/profile/cart/list");
    }, [navigate]);

    const applyCouponOnClick = () => {
        dispatch(getCouponStatusThunk(coupon)).then((result) => {
            if (result.payload && getCouponStatusThunk.fulfilled.match(result)) {
                if (result.payload.is_valid) {
                    toast.success("کد تخفیف اعمال شد!");
                    setShowCouponModal(false)
                } else toast.error("اعتبار کد تخفیف تمام شده است!");
            } else {
                toast.error(
                    (
                        result.payload as {
                            detail?: string;
                        }
                    )?.detail ?? "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید."
                );
            }
        });
    };

    const displayAccessories = useMemo<boolean>(() => {
        if (user == null)
            return false
        const userAccessories = user.accessories
        return true;
    }, [user])

    const accessoriesToDisplay = useMemo<AccessoryDto[]>(() => {
        if (!user)
            return [];
        const userAccessories = user.accessories.map(a => a.id);
        return accessoryList.filter(accessory => !userAccessories.includes(accessory.id));
    }, [user, accessoryList]);

    const dieInHonorOfMoney = useCallback(() => {
        dispatch(
            finalizePaymentThunk({
                coupon: couponStatus && couponStatus.is_valid ? coupon : "",
                accessories: selectedAccessories,
            })
        ).then((result) => {
            if (finalizePaymentThunk.fulfilled.match(result)) {
                if (result.payload.payment_url)
                    location.href = result.payload.payment_url;
                else
                    toast.error(
                        result.payload?.detail ??
                        "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید."
                    );
            } else {
                const payload = result.payload as FinalizePaymentResponse;
                toast.error(
                    payload.detail ?? "ارور نامشخص! لطفا با پیشتیبانی ارتباط بگیرید."
                );
            }
        });
    }, [coupon, couponStatus, dispatch, selectedAccessories]);

    const handleAccessoryClick = (id: AccessoryDto["id"]) => {
        const exist = selectedAccessories.some((accessoryID) => id === accessoryID);

        if (exist) {
            dispatch(cartActions.removeAccessory(id));
        } else {
            dispatch(cartActions.addAccessory(id));
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
                <div className="flex flex-wrap gap-4 items-center justify-center w-full px-4">
                    {!accessoryLoading ?
                        displayAccessories && accessoriesToDisplay.length > 0 ? (
                                <div className="flex flex-col gap-4 items-center justify-start w-full px-4">
                                    <h1 className="text-4xl font-bold mb-6 mt-4">محصول اضافه</h1>
                                    {accessoryList.map((accessory) => (
                                        <SelectableCard
                                            title={accessory.name}
                                            description={accessory.description}
                                            active={selectedAccessories.some(
                                                (accessoryID) => accessory.id === accessoryID
                                            )}
                                            image={accessory.img}
                                            onClick={() => handleAccessoryClick(accessory.id)}
                                            key={accessory.id}
                                        />
                                    ))}
                                </div>
                            ) :
                            (
                                <>

                                </>
                            ) :
                        (
                            <>
                                <Skeleton borderRadius={8} width={150} height={60}/>
                                <Skeleton borderRadius={8} width={150} height={60}/>
                                <Skeleton borderRadius={8} width={150} height={60}/>
                            </>
                        )}
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
                <div className="flex flex-col w-full  ">
                    {discountedAmount == null ? (
                        <div className="flex justify-between">
                            <p>مجموع قابل پرداخت:</p>
                            <p className="text-3xl font-bold">
                                {digitsToPersian(String(totalAmount))}
                                <span className="text-sm font-normal">تومان</span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex gap-1">
                            <p className="ml-auto">مجموع قابل پرداخت:</p>
                            <p className="line-through text-xl text-red-500">
                                {digitsToPersian(String(totalAmount))}
                            </p>
                            <p className="text-green-500 text-3xl font-bold">
                                {digitsToPersian(String(discountedAmount))}
                                <span className="text-sm font-normal">تومان</span>
                            </p>
                        </div>
                    )}
                    <p
                        className="text-secondary cursor-pointer mt-1"
                        onClick={() => setShowCouponModal(true)}
                    >
                        کد تخفیف دارید؟
                    </p>
                </div>
                <div className="flex gap-2 w-full">
                    <Button
                        onClick={takeAStepBackMortalAndThouShallBeForgiven}
                        className="border-2"
                        variant={ButtonVariants.OUTLINE}
                    >
                        قبلی
                    </Button>
                    <Button onClick={dieInHonorOfMoney}>پرداخت</Button>
                </div>
            </div>
            {showCouponModal && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-999">
                    <div
                        className="absolute w-full h-full bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowCouponModal(false)}
                    ></div>
                    <div className="flex flex-col w-5/6 lg:w-1/2 bg-dark-gray h-[200px] p-4 rounded-xl z-999">
                        <div className="mb-2">
                            <IoCloseCircleSharp
                                className="cursor-pointer"
                                size={24}
                                onClick={() => setShowCouponModal(false)}
                            />
                        </div>
                        <InputField
                            className="grow"
                            type={"text"}
                            value={coupon}
                            placeholder={"MinosPrime"}
                            label={"کد تخفیف؟"}
                            inputChangeHandler={(e) => setCoupon(e.target.value)}
                        />
                        <Button
                            className="text-[1rem] w-full"
                            variant={ButtonVariants.FILL}
                            disabled={coupon === ""}
                            onClick={applyCouponOnClick}
                        >
                            اعمال
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartPayment;
