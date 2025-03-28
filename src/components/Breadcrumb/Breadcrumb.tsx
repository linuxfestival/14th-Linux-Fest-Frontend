import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import { digitsToLatin } from "../../utils/digitsToPersian";

interface Step {
  id: number;
  label: string;
  path: string;
}

interface BreadcrumbProps {
  currentStep: number;
  steps: Step[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentStep, steps }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex items-center justify-between">
      {steps.map((step) => (
        <div
          key={step.id}
          className="relative flex items-center z-1 cursor-pointer"
          onClick={() => step.id <= currentStep && navigate(step.path)}
        >
          <span
            className={clsx(
              "h-8 w-8 rounded-full transition-colors duration-800",
              {
                ["bg-green-500"]: step.id <= currentStep,
                ["bg-gray-300"]: step.id > currentStep,
              }
            )}
          />
          <span
            className={clsx(
              "absolute hidden sm:block top-0 left-1/2 -translate-y-full -translate-x-1/2 w-max transition-colors duration-800 text-sm sm:text-base",
              {
                ["text-green-500"]: step.id <= currentStep,
                ["text-gray-300"]: step.id > currentStep,
              }
            )}
          >
            {step.label}
          </span>
          <span
            className={clsx(
              "absolute sm:hidden top-0 left-1/2 -translate-y-full -translate-x-1/2 w-max transition-colors duration-800 text-sm sm:text-base",
              {
                ["text-green-500"]: step.id <= currentStep,
                ["text-gray-300"]: step.id > currentStep,
              }
            )}
          >
            {digitsToLatin(String(step.id))}
          </span>
        </div>
      ))}
      <div className="absolute w-full h-2 bg-[#404040] top-1/2 -translate-y-1/2 z-0">
        <div
          className="bg-green-500 h-full transition-all  duration-500"
          style={{
            width: ((currentStep - 1) / (steps.length - 1)) * 100 + "%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Breadcrumb;
