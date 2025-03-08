import React from "react";

enum SkeletonVariants {
  CIRCLE = "rounded-full",
  RECTANGLE = "",
  TEXT = "rounded",
}

interface Props {
  variant?: SkeletonVariants;
  width: number;
  height: number;
  borderRadius?: number;
}

const Skeleton = ({
  variant = SkeletonVariants.RECTANGLE,
  width,
  height,
  borderRadius,
}: Props) => {
  const baseStyles = "bg-gray-300 animate-pulse";

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
      className={`${baseStyles} ${variantStyles[variant]}`}
      style={{
        width: width,
        height: height,
        ...customBorderRadius,
      }}
    />
  );
};

export default Skeleton;
