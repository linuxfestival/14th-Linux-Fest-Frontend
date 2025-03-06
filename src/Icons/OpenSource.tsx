import React from "react";

interface Props {
  className?: string;
}

const OpenSource = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="168"
      height="168"
      fill="none"
      viewBox="0 0 168 168"
      className={className}
    >
      <path
        fill="#B80C09"
        d="M118.006 7.798a83.334 83.334 0 0 1-32.682 159.316 8.35 8.35 0 0 1-6.05-2.45 8.34 8.34 0 0 1-2.429-6.059l1.094-50.121a8.333 8.333 0 0 1 7.5-8.115 16.66 16.66 0 0 0 14.821-14.134 16.666 16.666 0 1 0-29.436 8.042 8.333 8.333 0 0 1-.473 11.034l-34.834 36.066a8.35 8.35 0 0 1-6.013 2.545 8.32 8.32 0 0 1-6.002-2.57A83.335 83.335 0 0 1 115.842 6.86z"
      ></path>
    </svg>
  );
};

export default OpenSource;
