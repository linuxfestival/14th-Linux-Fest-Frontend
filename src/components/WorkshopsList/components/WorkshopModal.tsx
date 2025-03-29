import React from "react";
import { createPortal } from "react-dom";
import { PresentationDto } from "../../../core/presentations/presentations.dto";
import { IoCloseOutline, IoPricetag, IoTime } from "react-icons/io5";
import clsx from "clsx";
import Divider from "../../Divider/Divider";

interface Props {
  presentation: PresentationDto;
  price: number;
  dateTime?: string;
  onClose: () => void;
}

const WorkshopModal = ({ presentation, price, dateTime, onClose }: Props) => {
  return createPortal(
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-999">
      <div
        className="absolute w-full h-full bg-black/20 backdrop-blur-md"
        onClick={() => onClose()}
      />
      <div className="w-3/4 max-h-[800px] h-max flex flex-col gap-6 bg-bg-secondary px-8 py-8 rounded-xl z-999">
        <div className="w-full flex flex-row-reverse justify-between">
          <IoCloseOutline
            size={24}
            className="cursor-pointer mr-4"
            onClick={() => onClose()}
          />
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div
              className={clsx("font-bold text-xl", {
                ["animate-marquee"]: presentation.en_title.length > 40,
              })}
            >
              {presentation?.en_title}
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center">
          <img
            src="https://raw.githubusercontent.com/gist/vschmidt94/7ae2c23fede9f53bf63da4d7ace5fc14/raw/e41ed2bd565a54e90b33209dc820086e93121ab5/retro_gruvbox_linux_wallpaper.svg"
            className="w-1/4 h-[100px] rounded-md"
          />
          <div className="flex flex-col justify-center items-start">
            <div className="w-full flex justify-center items-center gap-2 px-4">
              <IoTime size={24} className="text-indigo" />
              <p className="text-lg text-white" dir="ltr">
                {dateTime}
              </p>
            </div>
            <div
              className={clsx(
                "w-full flex justify-start items-center gap-2 mt-2 px-4"
              )}
            >
              <IoPricetag size={24} className="text-indigo" />
              <p className="text-white text-lg">
                {price === 0 ? "رایگان!" : `${price / 1000} هزار تومان`}
              </p>
            </div>
          </div>
        </div>
        <div
          className="w-full h-max mt-4 text-text-gray"
          dangerouslySetInnerHTML={{ __html: presentation.en_description }}
        />
        <div className="w-full flex flex-col justify-start items-start">
          <Divider title="ارائه دهندگان" />
          <div className="flex flex-col gap-2 mt-2 px-4">
            {presentation?.presenters.map((presenter, index) => {
              return (
                <div className="flex justify-start items-center gap-2">
                  <img
                    key={index}
                    src={presenter.avatar}
                    className="w-[32px] h-[32px] rounded-full"
                  />
                  <p className="text-lg">
                    {presenter.first_name} {presenter.last_name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>,
    document.body
  );
};

export default WorkshopModal;
