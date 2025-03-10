import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  number: number;
  moreThan?: boolean;
  increment?: boolean;
}

const StaticsCard = ({
  title,
  number,
  moreThan = false,
  increment = false,
}: Props) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (!increment) return;

    let start = number;

    let incrementTime = Math.floor(Math.random() * 10) * 100;

    let timer = setInterval(() => {
      start += 1;
      setDisplayNumber(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [number]);

  const convertToPersianText = (num: number) => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const persianNumbers = (num: number) =>
      num
        .toString()
        .split("")
        .map((digit) => persianDigits[parseInt(digit)])
        .join("");

    if (num >= 1_000_000_000_000) {
      return `${persianNumbers(Math.floor(num / 1_000_000_000_000))} تریلیون`;
    } else if (num >= 1_000_000) {
      return `${persianNumbers(Math.floor(num / 1_000_000))} میلیون`;
    } else if (num >= 1_000) {
      return `${persianNumbers(Math.floor(num / 1_000))} هزار`;
    } else {
      return persianNumbers(num);
    }
  };

  return (
    <div className="flex flex-col justify-end items-center rounded-xl gap-5 w-full">
      <h2 className="font-bold text-white text-center text-3xl xl:text-4xl">
        {moreThan && "+"}
        {convertToPersianText(displayNumber)}
      </h2>
      <p className="text-xs md:text-xl lg:text-2xl text-text-gray mt-auto text-center">
        {title}
      </p>
    </div>
  );
};

export default StaticsCard;
