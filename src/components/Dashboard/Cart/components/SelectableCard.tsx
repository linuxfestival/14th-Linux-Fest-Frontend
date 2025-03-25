import clsx from "clsx";
import React, { useState } from "react";

interface Props {
  title: string;
  description?: string;
  active: boolean;
  image: string;
  onClick: () => void;
}

const SelectableCard = ({
  title,
  description,
  active,
  image,
  onClick,
}: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 border-1 p-2 rounded-lg transition-colors w-max cursor-pointer select-none",
        {
          ["border-secondary"]: active,
          ["border-[#404040]"]: !active,
        }
      )}
      onClick={onClick}
    >
      <img src={image} className="w-[60px] h-[60px] rounded-lg" />
      <div className="flex flex-col justify-center items-start">
        <h1 className="text-md font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-text-gray">{description}</p>}
      </div>
      <div
        className={clsx(
          "flex justify-center items-center h-5 w-5 p-1 border-2 rounded-full transition-colors",
          {
            ["border-secondary"]: active,
            ["border-[#404040]"]: !active,
          }
        )}
      >
        <div
          className={clsx("h-full w-full rounded-full transition-colors", {
            ["bg-secondary"]: active,
            ["bg-transparent"]: !active,
          })}
        ></div>
      </div>
    </div>
  );
};

export default SelectableCard;
