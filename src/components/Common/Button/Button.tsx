import React, { ReactNode } from "react";
import clsx from "clsx";
import Loading from "../icons/Loading";

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
  loading?: boolean;
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
  loading = false,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props) => {
  return (
    <div
      className={clsx(
        "px-[16px] py-[8px] sm:py-[12px] text-center rounded-2xl text-white cursor-pointer transition-all rounded-2xl ",
        {
          ["bg-secondary text-primary hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"]:
            variant === ButtonVariants.FILL,
          ["min-w-max w-1/2 font-medium text-lg"]: size === ButtonSizes.MEDIUM,
          ["w-full font-bold text-sm md:text-md lg:text-xl"]:
            size === ButtonSizes.LARGE,
          ["!bg-[#878787] !cursor-not-allowed select-none"]: disabled,
          ["flex justify-center items-center"]: loading,
        },
        className,
      )}
      onClick={
        disabled || loading || !onClick
          ? undefined
          : (e) => {
              e.stopPropagation(); // TODO: put prop for this, but i forgot for what page i put this here so i will not remove it
              e.preventDefault();
              onClick();
            }
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {loading ? <Loading className="mr-3 size-5 animate-spin" /> : children}
    </div>
  );
};

export default Button;
