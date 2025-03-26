import React from "react";

export enum SkeletonVariants {
  CIRCLE = "rounded-full",
  RECTANGLE = "",
  TEXT = "rounded",
}

interface Props {
  variant?: SkeletonVariants;
  width: number;
  height: number;
  borderRadius?: number;
  className?: string;
}

const Skeleton = ({
  variant = SkeletonVariants.RECTANGLE,
  width,
  height,
  borderRadius,
  className,
}: Props) => {
  const baseStyles = "bg-[#707070] animate-pulse";

  const variantStyles = {
    [SkeletonVariants.CIRCLE]: "rounded-full",
    [SkeletonVariants.RECTANGLE]: "",
    [SkeletonVariants.TEXT]: "rounded",
  };

  const customBorderRadius = borderRadius
    ? { borderRadius: `${borderRadius}px` }
    : {};

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width: width,
        height: height,
        ...customBorderRadius,
      }}
    />
  );
};

export default Skeleton;
