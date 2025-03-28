import * as React from "react";

const Loading = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="mr-3 -ml-1 size-5 animate-spin text-white"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-25"
    ></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z"
      className="opacity-75"
    ></path>
  </svg>
);

export default Loading;
