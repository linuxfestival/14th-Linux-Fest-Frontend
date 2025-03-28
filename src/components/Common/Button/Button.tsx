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
          ["bg-secondary hover:bg-[#ee346c]"]: variant === ButtonVariants.FILL,
          ["min-w-max w-1/2 font-medium text-lg"]: size === ButtonSizes.MEDIUM,
          ["w-full font-bold text-sm md:text-md lg:text-xl"]:
            size === ButtonSizes.LARGE,
          ["!bg-[#878787] !cursor-not-allowed select-none"]: disabled,
        },
        className
      )}
      onClick={
        disabled && onClick
          ? undefined
          : (e) => {
              e.stopPropagation();
              onClick?.();
            }
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Button;
