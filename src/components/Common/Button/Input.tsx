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
      <label htmlFor="input" className="text-sm font-light text-gray-500 mb-1">
        {props.label}
      </label>
      <input
        type={props.type}
        className={`p-3 text-sm rounded-lg bg-gray-100 text-gray-600 w-full h-14 focus:outline-none focus:border-blue-400 ${borderClass}`}
        placeholder={props.placeholder}
        value={props.value}
        name="input"
        required={props.required}
        dir={props.textDirection}
        onChange={props.inputChangeHandler}
      />
      {renderInputSubtitle()}
    </div>
  );
}
