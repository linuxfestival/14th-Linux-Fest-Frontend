import React from "react";

interface Props {
  title: string;
}

const Divider = ({ title }: Props) => {
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="w-full bg-text-gray/50 h-[2px]" />
      <h1 className="min-w-max px-4 text-text-gray/80 text-2xl">{title}</h1>
      <div className="w-full bg-text-gray/50 h-[2px]" />
    </div>
  );
};

export default Divider;
