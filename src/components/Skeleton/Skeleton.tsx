import React from "react";

export enum SkeletonVariants {
  CIRCLE = "rounded-full",
  RECTANGLE = "",
  TEXT = "rounded",
}

interface Props {
  variant?: SkeletonVariants;
  width: number | string;
  height: number | string;
  borderRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

const Skeleton = ({
  variant = SkeletonVariants.RECTANGLE,
  width,
  height,
  borderRadius,
  className,
  children,
}: Props) => {
  const baseStyles = "skeleton-shimmer";

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
    >
      {children}
    </div>
  );
};

export default Skeleton;
