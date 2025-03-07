import AlertIcon from "../icons/AlertIcon";
import SuccessIcon from "../icons/SuccessIcon";

interface InputFieldProps {
  type: string;
  value: string;
  placeholder: string;
  label: string;
  textDirection?: string;
  required?: boolean;
  inputChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  regexValid?: boolean | null;
  successText?: string;
  errorText?: string;
}

export default function InputField({ ...props }: InputFieldProps) {
  const borderClass =
    props.regexValid === true
      ? "border-2 border-green-500"
      : props.regexValid === false
      ? "border-2 border-red-500"
      : "border border-gray-300";

  const renderInputSubtitle = () => {
    if (props.regexValid === true) {
      return (
        <div className="flex items-center gap-2 text-sm mt-1">
          <SuccessIcon color="#09B188" />
          <div className="text-green-500">{props.successText}</div>
        </div>
      );
    } else if (props.regexValid === false) {
      return (
        <div className="flex items-center gap-2 text-sm mt-1">
          <AlertIcon color="#F74455" />
          <div className="text-red-500">{props.errorText}</div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <div className="relative">
        <input
          type={props.type}
          id="floating_outlined"
          className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-text-white bg-transparent rounded-[14px] border-1 border-secondary-gray appearance-none focus:outline-none focus:ring-0 placeholder:text-text-white peer"
          placeholder={props.placeholder}
          onChange={props.inputChangeHandler}
          dir={props.textDirection}
          required={props.required}
        />
        <label className="absolute top-0 right-4 text-sm text-secondary-gray bg-bg-secondary duration-300 z-10 origin-[0] peer-focus:px-1 peer-placeholder-shown:scale-100 -translate-y-1/2">
          {props.label}
        </label>
      </div>
      {renderInputSubtitle()}
    </div>
  );
}
