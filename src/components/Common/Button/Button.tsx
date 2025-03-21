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
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Button = ({
  children,
  size = ButtonSizes.MEDIUM,
  variant = ButtonVariants.FILL,
  disabled = false,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  return (
    <div
      className={clsx(
        "px-[16px] py-[8px] sm:py-[12px] text-center rounded-2xl text-white cursor-pointer",
        {
          ["bg-secondary hover:bg-[#ee346c]"]:
            !disabled && variant === ButtonVariants.FILL,
          ["bg-[#B4B4B4]"]: disabled && variant === ButtonVariants.FILL,
          [""]: size === ButtonSizes.SMALL,
          ["min-w-max w-1/2 font-medium text-sm md:text-md lg:text-lg"]:
            size === ButtonSizes.MEDIUM,
          ["w-full font-bold text-sm md:text-md lg:text-xl"]:
            size === ButtonSizes.LARGE,
        },
        className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Button;
