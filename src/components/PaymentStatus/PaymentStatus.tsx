import React, {useEffect, useState} from "react";
import Lottie from "lottie-react";
import {Link, useLocation} from "react-router-dom";
import successAnimation from "../../assets/lottie/success.json";
import failAnimation from "../../assets/lottie/fail.json";
import loadingAnimation from "../../assets/lottie/loading.json";
import {RootState, useAppDispatch} from "../../store.ts";
import {verifyPaymentThunk} from "../../core/payment/payment.thunk.ts";
import {useSelector} from "react-redux";

interface Props {
    successful?: boolean;
}

type PaymentStatusQuery = "NOK" | "OK"

const PaymentStatus = () => {
    const [successful, setSuccessful] = useState(false);
    const [authority, setAuthority] = useState<string | null>(null);

    const location = useLocation()
    const dispatch = useAppDispatch();

    const {loading} = useSelector((rootState: RootState) => rootState.payment)

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const authority = query.get("Authority");
        const status = query.get("Status") as PaymentStatusQuery;

        if (!authority || !status)
            return;

        setAuthority(authority);
        setSuccessful(status === "OK");

        if (status === "NOK") {
            return;
        }

        dispatch(verifyPaymentThunk({
            authority
        }))
            .then(response => {
                if (verifyPaymentThunk.fulfilled.match(response))
                    setSuccessful(true);
                else
                    setSuccessful(false);
            })
    }, [dispatch, location.search])

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-[#151515] text-white px-6">
            <div className="flex flex-col items-center gap-6 bg-[#1E1E1E] p-8 rounded-lg shadow-lg w-full max-w-md">
                {loading ?
                    (
                        <>
                            <Lottie
                                animationData={loadingAnimation}
                                className="w-[80px] h-[80px]"
                                loop={false}
                                autoplay={true}
                            />
                            <h1 className="text-3xl font-bold text-gray-500">صبر کنید</h1>
                        </>
                    )
                    : successful ? (
                        <>
                            <Lottie
                                animationData={successAnimation}
                                className="w-[80px] h-[80px]"
                                loop={false}
                                autoplay={true}
                            />
                            <h1 className="text-3xl font-bold text-green-500">پرداخت موفق</h1>
                            <p className="text-lg text-text-gray">
                                تراکنش شما با موفقیت انجام شد.
                            </p>
                        </>
                    ) : (
                        <>
                            <Lottie
                                animationData={failAnimation}
                                className="w-[80px] h-[80px]"
                                style={{width: "80px", height: "80px"}}
                                loop={false}
                                autoplay={true}
                            />
                            <h1 className="text-3xl font-bold text-red-500">پرداخت ناموفق</h1>
                            <p className="text-lg text-text-gray text-center">
                                پرداخت شما با خطا مواجه شد. در صورتی که مبلغی از حساب شما کسر شده
                                باشد، حداکثر تا ۷۲ ساعت به حساب شما بازگردانده خواهد شد.
                            </p>
                        </>
                    )}
                <div className="flex flex-col items-center gap-4">
                    {authority && (
                        <p className="text-sm text-text-gray">
                            شناسه تراکنش: <span className="text-indigo">{authority}</span>
                        </p>
                    )}
                    <Link
                        to="/"
                        className="px-6 py-3 bg-indigo text-white rounded-lg hover:bg-indigo-dark transition-all"
                    >
                        بازگشت به صفحه اصلی
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
