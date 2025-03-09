import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const ArrowRight: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={width}
      height={height}
      className={className}
      fill="currentColor"
    >
      <g transform="translate(1.4066 1.4066) scale(2.81 2.81)">
        <path d="M 24.25 90 c -0.896 0 -1.792 -0.342 -2.475 -1.025 c -1.367 -1.366 -1.367 -3.583 0 -4.949 L 60.8 45 L 21.775 5.975 c -1.367 -1.367 -1.367 -3.583 0 -4.95 c 1.367 -1.366 3.583 -1.366 4.95 0 l 41.5 41.5 c 1.367 1.366 1.367 3.583 0 4.949 l -41.5 41.5 C 26.042 89.658 25.146 90 24.25 90 z" />
      </g>
    </svg>
  );
};

export default ArrowRight;
