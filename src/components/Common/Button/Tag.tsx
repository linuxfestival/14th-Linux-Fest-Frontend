import clsx from "clsx";
import React from "react";
import { Interface } from "readline";

export enum TagVariants {
  PINK,
  INDIGO,
  RED,
  WHITE,
  YELLOW,
  GREEN,
}

interface Props {
  text: string;
  variant?: TagVariants;
}

export const Tag = ({ text, variant = TagVariants.WHITE }: Props) => {
  return (
    <div
      className={clsx("w-max bg-none rounded-full px-2 border-1 mt-1", {
        ["border-secondary text-secondary"]: variant === TagVariants.PINK,
        ["border-indigo text-indigo"]: variant === TagVariants.INDIGO,
        ["border-ubuntu-red text-ubuntu-red"]: variant === TagVariants.RED,
        ["border-white text-white"]: variant === TagVariants.WHITE,
        ["border-yellow-600 text-yellow-600"]: variant === TagVariants.YELLOW,
        ["border-green-600 text-green-600"]: variant === TagVariants.GREEN,
      })}
      dir="auto"
    >
      {text}
    </div>
  );
};
