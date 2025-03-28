import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoCloseCircle, IoCopy, IoTimeOutline } from "react-icons/io5";
import BillingModal from "./components/BillingModal.tsx";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store.ts";
import { getPaymentListThunk } from "../../../core/payment/payment.thunk.ts";
import { PaymentDto } from "../../../core/payment/payment.dto.ts";
import Button from "../../Common/Button/Button.tsx";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { convertAndFormatToPersian } from "../../../utils/digitsToPersian.ts";

const Billings = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const dispatch = useAppDispatch();
  const { payments } = useSelector((state: RootState) => state.payment);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.info("شناسه تراکنش کپی شد!");
  };

  useEffect(() => {
    dispatch(getPaymentListThunk());
  }, [dispatch]);

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-4xl font-bold mb-6">پرداخت‌ها</h1>
      <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
        {currentPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-[#2C2C2C] w-full px-6 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-[#3A3A3A] transition-all"
            onClick={() => setSelectedPayment(payment)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {payment.payment_state === "COMPLETED" ? (
                  <FaCheckCircle size={24} className="text-green-500" />
                ) : payment.payment_state === "FAILED" ? (
                  <IoCloseCircle size={24} className="text-red-500" />
                ) : (
                  <MdOutlineAccessTimeFilled
                    size={24}
                    className="text-gray-500"
                  />
                )}
                <div>
                  <p className="text-lg font-bold">
                    {convertAndFormatToPersian(payment.total_price + "")}
                  </p>
                  <p className="text-sm text-text-gray hidden sm:flex items-center gap-1">
                    <IoTimeOutline size={16} />
                    {new Date(payment.created_date).toLocaleString("fa")}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-1 cursor-pointer text-sm text-indigo hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(payment.authority);
                }}
              >
                <IoCopy size={16} />
                کپی شناسه
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center w-full px-4 max-w-[400px] gap-4 mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          قبلی
        </Button>
        <span className="text-white text-nowrap">
          {currentPage} از {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          بعدی
        </Button>
      </div>
      {selectedPayment && (
        <BillingModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
};

export default Billings;
