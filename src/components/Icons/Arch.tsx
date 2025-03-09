import React from "react";

interface Props {
  className?: string;
  size: number;
  style: React.CSSProperties;
}

const Arch = ({ className, size, style, ...props }: Props) => {
  const aspectRatio = 190 / 172;
  const height = size * aspectRatio;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={height}
      fill="none"
      viewBox="0 0 172 190"
      className={className}
      style={style}
      {...props}
    >
      <path
        fill="#446085"
        fillRule="evenodd"
        d="M50.636.816c-3.739 20.282-5.796 33.469-10.515 53.375 6.353 4.436 14.078 9.534 25.964 14.634-12.11-2.271-20.679-5.298-27.36-8.899C32.572 84.86 22.262 120.697.619 189.955c23.895-21.321 42.935-35.361 61.785-43.127a50.8 50.8 0 0 1-3.707-11.363l-.149-.877c-3.185-17.486 3.083-32.745 13.992-34.065s22.329 11.795 25.515 29.281c.6 3.29.885 6.516.846 9.571 20.193-.238 43.021 5.073 73.023 14.968-7.304-8.626-13.84-16.411-20.078-23.823-8.234-4.023-17.118-9.638-33.816-14.246 10.931.539 19.002 2.104 25.513 4.376C80.052 44.943 73.991 34.389 50.636.816"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default Arch;
