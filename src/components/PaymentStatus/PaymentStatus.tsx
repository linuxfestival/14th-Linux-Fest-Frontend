import React from "react";
import Lottie, { useLottie } from "lottie-react";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { Link, useParams, useSearchParams } from "react-router-dom";
import successAnimation from "../../assets/lottie/success.json";
import failAnimation from "../../assets/lottie/fail.json";

interface Props {
  successful?: boolean;
}

const PaymentStatus = ({ successful = false }: Props) => {
  const urlParams = useParams();
  const transactionID = urlParams.transactionID;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#151515] text-white px-6">
      <div className="flex flex-col items-center gap-6 bg-[#1E1E1E] p-8 rounded-lg shadow-lg w-full max-w-md">
        {successful ? (
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
              style={{ width: "80px", height: "80px" }}
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
          {transactionID && (
            <p className="text-sm text-text-gray">
              شناسه تراکنش: <span className="text-indigo">{transactionID}</span>
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
