import BadgeLinux from "../../assets/saygex.png";
import Button from "../../components/Common/Button/Button.tsx";
import { useState } from "react";
import { motion } from "framer-motion";

const Signup = () => {
  return (
    <div className="relative h-[100dvh] overflow-scroll w-full p-4 md:p-13 md:flex justify-center items-center bg-pattern">
      <div className="relative flex rounded-4xl p-4 w-full md:h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl md:w-auto md:aspect-4/3">
        <div className="hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
          <img className="h-full object-cover" src={BadgeLinux} />
        </div>
        <div className="flex w-full md:w-4/7 flex-col md:m-10 items-end">
          <h1 className="text-4xl font-bold text-white">ثبت نام</h1>
          <p className="text-lg text-gray-300 mb-9">حساب کاربری دارید؟
            &nbsp;<a href="/login" className="text-[#ffdd03] no-underline hover:underline">وارد</a>&nbsp;
            شوید</p>
          <div className="flex p-2 gap-4 flex-col w-full pb-7 mb-6">
            <div className="flex gap-4 flex-col md:flex-row-reverse w-full right">
                <input
                type="text"
                placeholder="نام"
                className="w-full md:w-1/2 p-2 rounded-md border border-gray-300 text-right"
                />
                <input
                type="text"
                placeholder="نام خانوادگی"
                className="w-full md:w-1/2 p-2 rounded-md border border-gray-300 text-right"
                />
            </div>
            <input
              type="text"
              placeholder="یوزرنام"
              className="w-full p-2 rounded-md border border-gray-300 text-right"
            />
            <input
              type="password"
              placeholder="پاسور"
              className="w-full p-2 rounded-md border border-gray-300 text-right"
            />
            <input
              type="email"
              placeholder="ایمیل؟"
              className="w-full p-2 rounded-md border border-gray-300 text-right"
            />
            <input
              type="text"
              placeholder="تلفن"
              className="w-full p-2 rounded-md border border-gray-300 text-right"
            />
            <input
              type="text"
              placeholder="گی سکس"
              className="w-full p-2 rounded-md border border-gray-300 text-right"
            />
          </div>
          <Button className="w-full">
            ثبت نام
          </Button>
          <div className="w-full flex items-center mt-4 mb-2">
            <hr className="flex-grow border-1 border-white" />
            <span className="mx-2 text-white">باشه دیتاتو بده اینا</span>
            <hr className="flex-grow border-1 border-white" />
          </div>
          <div className="w-full flex-row md:flex justify-between items-center gap-2">
            <button className="w-full md:w-1/2 rounded-full border-white border-1 p-4 mb-3 md:mb-0 bg-[#101010cc] flex items-center justify-center gap-2 text-white">
              لاگین با گوگل
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Google-favicon-2015.png" alt="Google Logo" className="w-5 h-5" />
            </button>
            <button className="w-full md:w-1/2 rounded-full border-white border-1 p-4 bg-[#101010cc] flex items-center justify-center gap-2 text-white">
              لاگین با لینکداین
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn Logo" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;