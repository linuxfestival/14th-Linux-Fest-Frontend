import "./Fallback.css";
import React from "react";

const Fallback = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-secondary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-transparent border-[#15FAB4] rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default Fallback;
