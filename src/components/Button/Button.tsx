import React, { ReactNode } from "react";
import clsx from "clsx";

export enum ButtonSizes {
  SMALL,
  MEDIUM,
  LARGE,
}

export enum ButtonVariants {
  FILL,
  OUTLINE,
  NONE,
}

interface Props {
  children: ReactNode;
  size?: ButtonSizes;
  variant?: ButtonVariants;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  size = ButtonSizes.MEDIUM,
  variant = ButtonVariants.FILL,
  disabled = false,
  className,
}: Props) => {
  return (
    <div
      className={clsx(
        "px-[16px] py-[16px] text-center rounded-2xl text-white cursor-pointer",
        {
          ["bg-secondary"]: !disabled && variant === ButtonVariants.FILL,
          ["bg-[#B4B4B4]"]: disabled && variant === ButtonVariants.FILL,
          [""]: size === ButtonSizes.SMALL,
          ["min-w-max w-1/2 font-medium text-lg"]: size === ButtonSizes.MEDIUM,
          ["w-full font-medium text-lg"]: size === ButtonSizes.LARGE,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default Button;
