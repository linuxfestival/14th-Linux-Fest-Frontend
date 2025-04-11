import React, { Component } from "react";
import { IconType } from "react-icons/lib";

interface Props {
  title: string;
  description: string;
  icon: IconType;
}

const InfoCard = ({ title, description, icon: Icon }: Props) => {
  return (
    <div className="bg-[#2c2c2c] p-6 flex flex-col justify-center items-center gap-2 rounded-xl min-w-[350px] sm:min-w-[450px] ]w-full m-2 hover:mx-1 hover:my-0 hover:p-8 hover:cursor-pointer hover:bg-[#2a2a2a] shadow-lg border-1 border-white/10 transition-all duration-250">
      <Icon size={48} />
      <p className="text-xl sm:text-3xl font-bold text-white mt-4">{title}</p>
      <p className="text-md sm:text-2xl text-text-gray">{description}</p>
    </div>
  );
};

export default InfoCard;
