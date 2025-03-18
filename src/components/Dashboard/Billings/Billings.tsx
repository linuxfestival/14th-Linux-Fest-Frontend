import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoCopy, IoReceiptOutline, IoTimeOutline } from "react-icons/io5";
import BilingModal from "./components/BilingModal";

interface Payment {
  id: string;
  time: string;
  price: string;
  items: string[];
}

const payments: Payment[] = [
  {
    id: "TX123456789",
    time: "۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰",
    price: "44 هزار تومان",
    items: ["کارگاه لینوکس", "کارگاه DevOps"],
  },
  {
    id: "TX987654321",
    time: "۱۴۰۴/۰۲/۱۰ - ۱۴:۰۰",
    price: "88 هزار تومان",
    items: ["کارگاه Python", "کارگاه Open Source"],
  },
];

const Billings = () => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.info("شناسه تراکنش کپی شد!");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-full w-full">
      <h1 className="text-4xl font-bold mb-6">پرداخت‌ها</h1>
      <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-[#2C2C2C] w-full px-6 py-4 rounded-lg shadow-lg cursor-pointer hover:bg-[#3A3A3A] transition-all"
            onClick={() => setSelectedPayment(payment)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <IoReceiptOutline size={24} className="text-indigo" />
                <div>
                  <p className="text-lg font-bold">{payment.price}</p>
                  <p className="text-sm text-text-gray flex items-center gap-1">
                    <IoTimeOutline size={16} />
                    {payment.time}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-1 cursor-pointer text-sm text-indigo hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(payment.id);
                }}
              >
                <IoCopy size={16} />
                کپی شناسه
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedPayment && (
        <BilingModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
};

export default Billings;
