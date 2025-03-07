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
      <div className="relative bg-primary w-full flex items-center justify-center">
        <div className="flex gap-1 absolute left-2">
          <div className="w-[15px] h-[15px] bg-[#FE534F] rounded-full"></div>
          <div className="w-[15px] h-[15px] bg-[#F7B72E] rounded-full"></div>
          <div className="w-[15px] h-[15px] bg-[#21C735] rounded-full"></div>
        </div>
        <span className="mt-1">{windowName}</span>
      </div>
      <div className="bg-light-gray w-full flex flex-col justify-around items-center py-15 text-center h-full">
        {children}
      </div>
    </div>
  );
};

export default Terminal;
