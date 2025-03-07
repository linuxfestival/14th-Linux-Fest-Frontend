import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  number: number;
  moreThan?: boolean;
}

const StaticsCard = ({ title, number, moreThan = false }: Props) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = number;
    if (start === end) return;

    let incrementTime = (2 / end) * 1000;

    let timer = setInterval(() => {
      start += 1;
      setDisplayNumber(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [number]);

  const convertToPersianText = (num: number) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const persianNumbers = num
      .toString()
      .split("")
      .map((digit) => persianDigits[parseInt(digit)])
      .join("");

    if (num >= 1_000_000_000_000) {
      return `${persianNumbers} تریلیون`;
    } else if (num >= 1_000_000) {
      return `${persianNumbers} میلیون`;
    } else if (num >= 1_000) {
      return `${persianNumbers} هزار`;
    } else {
      return persianNumbers;
    }
  };

  return (
    <div className="flex flex-col justify-end items-center rounded-xl gap-5 w-full">
      <h2 className="font-bold text-white text-center text-3xl xl:text-4xl">
        {moreThan && "+"}
        {convertToPersianText(displayNumber)}
      </h2>
      <p className="text-sm md:text-xl lg:text-2xl text-text-gray mt-auto text-center">
        {title}
      </p>
    </div>
  );
};

export default StaticsCard;
