import React from "react";
import { IoCopy, IoTimeOutline, IoClose } from "react-icons/io5";
import Button from "../../../Common/Button/Button";

interface BilingModalProps {
  payment: {
    id: string;
    time: string;
    price: string;
    items: string[];
  };
  onClose: () => void;
  onCopy: (id: string) => void;
}

const BilingModal: React.FC<BilingModalProps> = ({
  payment,
  onClose,
  onCopy,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div
        className="absolute top-0 bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-[#1E1E1E] w-[90%] max-w-lg px-8 py-6 rounded-xl shadow-2xl transform transition-transform scale-100">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">رسید پرداخت</h2>
        <div className="flex flex-col gap-4">
          <p className="text-lg flex items-center gap-2">
            <span className="font-bold">مبلغ:</span> {payment.price}
          </p>
          <p className="text-lg flex items-center gap-2">
            <IoTimeOutline size={20} />
            <span className="font-bold">زمان:</span> {payment.time}
          </p>
          <p className="text-lg flex items-center gap-2">
            <IoCopy size={20} />
            <span className="font-bold">شناسه تراکنش:</span>{" "}
            <span
              className="text-indigo cursor-pointer hover:underline"
              onClick={() => onCopy(payment.id)}
            >
              {payment.id}
            </span>
          </p>
        </div>
        <h3 className="text-lg font-bold mt-6">موارد خریداری شده:</h3>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          {payment.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Button
            className="px-8 py-2 bg-indigo text-white rounded-lg hover:bg-indigo-dark transition-all"
            onClick={onClose}
          >
            بستن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BilingModal;
