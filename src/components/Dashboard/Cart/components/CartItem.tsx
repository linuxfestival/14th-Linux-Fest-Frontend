import React from "react";
import { GrTrash } from "react-icons/gr";
import { IoPerson, IoTime, IoTrashBin } from "react-icons/io5";
import digitsToPersian from "../../../../utils/digitsToPersian";

const CartItem = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full bg-[#2C2C2C] md:px-4 md:py-2 rounded-lg shadow-lg md:h-[100px]">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
        className="block md:hidden lg:block min-w-1/6 min-h-[100px] md:min-w-1/4 h-full object-cover rounded-md"
      />
      <div className="flex flex-col justify-center items-start gap-1 w-full p-4">
        <h1 className="text-xl md:text-lg font-bold w-full md:w-max text-center">
          کارگاه لینوکس
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-1 text-text-gray mt-1 md:mt-0">
            <IoPerson />
            <p className="text-sm md:text-md">امیرحسین عقیقی</p>
          </div>
          <div className="flex items-center gap-1 text-text-gray">
            <IoTime />
            <p className="text-sm md:text-md" dir="ltr">
              ۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end w-full md:w-max px-4 pb-2 md:px-0 md:pb-0 min-w-max gap-5">
        <GrTrash size={16} className="text-red-400 cursor-pointer" />
        <h1 className="text-3xl md:text-3xl lg:text-2xl font-bold">
          {digitsToPersian("44")}
          <span className="text-sm">هزار تومان</span>
        </h1>
      </div>
    </div>
  );
};

export default CartItem;
