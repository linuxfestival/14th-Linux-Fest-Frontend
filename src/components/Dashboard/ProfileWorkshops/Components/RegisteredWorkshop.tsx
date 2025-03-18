import clsx from "clsx";
import React from "react";
import { RiShareForwardFill } from "react-icons/ri";

export enum WorkshopStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

interface Props {
  title: string;
  time: string;
  status: WorkshopStatus;
  live?: boolean;
}

const RegisteredWorkshop = ({ title, time, status, live }: Props) => {
  return (
    <div className="bg-[#404040] w-full px-4 py-2 rounded-lg relative shadow-lg">
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/000/701/690/small_2x/abstract-polygonal-banner-background.jpg"
            className="w-[50px] h-[50px] rounded-lg"
          />
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-xs text-text-gray">{time}</p>
          </div>
        </div>
        {status === WorkshopStatus.NOT_STARTED && (
          <p className="px-4 py-2 bg-[#802020] text-md font-bold rounded-full">
            برگزار نشده
          </p>
        )}{" "}
        {status === WorkshopStatus.IN_PROGRESS && (
          <div className="flex flex-row-reverse items-center gap-2">
            <p className="px-4 py-2 bg-indigo text-md font-bold rounded-full">
              درحال برگزاری
            </p>
            {live && (
              <div className="flex items-center bg-blue-500 text-white px-2 py-1 rounded-full gap-2">
                <RiShareForwardFill size={16} />
                <p className="text-md font-bold text-sm cursor-pointer">
                  ورود به کلاس
                </p>
              </div>
            )}
          </div>
        )}
        {status === WorkshopStatus.FINISHED && (
          <p className="px-4 py-2 bg-[#208020] text-md font-bold rounded-full">
            برگزار شده
          </p>
        )}
      </div>
      {live && (
        <span className="flex size-3 absolute -top-1 -right-1">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-blue-500"></span>
        </span>
      )}
    </div>
  );
};

export default RegisteredWorkshop;
