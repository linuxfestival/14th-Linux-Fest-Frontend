import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../../assets/404.png";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#151515] text-white px-6">
      <img src={notFoundImage} className="h-1/3 mb-6" alt="404 Not Found" />
      <h1 className="text-6xl font-bold text-indigo mb-4">404</h1>
      <p className="text-xl text-text-gray mb-6">
        صفحه‌ای که به دنبال آن هستید یافت نشد!
      </p>
      <div className="flex flex-col items-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-indigo text-white rounded-lg hover:bg-indigo-dark transition-all"
        >
          بازگشت به صفحه اصلی
        </Link>
        <p className="text-lg text-text-gray">یا به یکی از صفحات زیر بروید:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/profile/workshops"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            کارگاه‌های من
          </Link>
          <Link
            to="/profile/billing"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            پرداخت‌ها
          </Link>
          <Link
            to="/workshops"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            کارگاه‌ها
          </Link>
          <Link
            to="/faq"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
          >
            سوالات متداول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
