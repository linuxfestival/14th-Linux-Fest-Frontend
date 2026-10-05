import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../../assets/404.png";

const NotFound = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#151515] px-5 py-10 text-center text-white">
      <img
        src={notFoundImage}
        className="mb-6 h-auto max-h-64 w-full max-w-sm object-contain"
        alt="404 Not Found"
      />
      <h1 className="text-6xl font-bold text-indigo mb-4">404</h1>
      <p className="text-xl text-text-gray mb-6">
        صفحه‌ای که به دنبال آن هستید یافت نشد!
      </p>
      <div className="flex flex-col items-center gap-4">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo px-6 py-3 text-primary transition-colors hover:bg-indigo/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo"
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
