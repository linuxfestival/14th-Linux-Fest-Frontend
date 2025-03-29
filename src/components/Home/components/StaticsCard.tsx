import React, { useEffect, useRef } from "react";
import { CountUp } from "countup.js";

interface Props {
  title: string;
  number: number;
}

const StaticsCard = ({ title, number }: Props) => {
  const countupRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (countupRef.current) {
      const countUpAnim = new CountUp(countupRef.current, number, {
        startVal: number / 2,
        duration: 4,
        useGrouping: true,
        numerals: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyOnce: true,
      });

      if (!countUpAnim.error) {
        countUpAnim.start();
      } else {
        console.error(countUpAnim.error);
      }
    }
  }, [number]);

  return (
    <div className="flex flex-col justify-end items-center rounded-xl gap-5 w-full">
      <h2
        ref={countupRef}
        className="font-bold text-white text-center text-3xl xl:text-4xl"
      ></h2>
      <p className="text-xs md:text-xl lg:text-2xl text-text-gray mt-auto text-center">
        {title}
      </p>
    </div>
  );
};

export default StaticsCard;
