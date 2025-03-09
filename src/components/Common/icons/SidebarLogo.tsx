import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const SidebarLogo: React.FC<IconProps> = ({ width = 64, height = 64, color = "currentColor", className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect width="64" height="64" fill="url(#pattern0_203_787)" />
    <defs>
      <pattern id="pattern0_203_787" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_203_787" transform="scale(0.00195312)" />
      </pattern>
      <image
        id="image0_203_787"
        width="512"
        height="512"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAA..."
      />
    </defs>
  </svg>
);

export default SidebarLogo;
