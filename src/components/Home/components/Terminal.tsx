import clsx from "clsx";
import React, { ReactNode } from "react";

interface Props {
  windowName: string;
  children: ReactNode;
  className?: string;
}

const Terminal = ({ windowName, children, className }: Props) => {
  return (
    <div className={clsx("w-2/3 h-max mt-15", className)}>
      <div className="relative bg-primary w-full flex items-center justify-center rounded-t-lg">
        <div className="flex gap-1 sm:gap-2 md:gap-3 absolute right-2">
          <div className="w-[15px] h-[15px] bg-[#ff4748] rounded-full"></div>
          <div className="w-[15px] h-[15px] bg-[#9629cc] rounded-full"></div>
          <div className="w-[15px] h-[15px] bg-[#fccf18] rounded-full"></div>
        </div>
        <span className="mt-1">{windowName}</span>
      </div>
      <div className="bg-light-gray w-full flex flex-col justify-around items-center py-15 text-center h-full rounded-b-lg">
        {children}
      </div>
    </div>
  );
};

export default Terminal;
