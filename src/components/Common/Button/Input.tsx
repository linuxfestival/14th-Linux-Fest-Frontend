import clsx from "clsx";
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
  autocomplete?: string;
  className?: string;
  labelClassName?: string;
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
    <div className={"flex flex-col w-full relative " + props.className}>
      <fieldset className="rounded-[14px] border-1 border-secondary-gray">
        <input
          type={props.type}
          id="floating_outlined"
          className="block px-2.5 pb-3 pt-1.5 w-full text-sm text-text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
          placeholder={props.placeholder}
          onChange={props.inputChangeHandler}
          dir={props.textDirection}
          required={props.required}
          autoComplete={props?.autocomplete ?? ""}
          value={props.value}
        />
        <legend
          className={clsx(
            "text-sm text-secondary-gray duration-300 px-1 mr-4 peer-focus:px-2 peer-placeholder-shown:scale-100"
          )}
        >
          {props.label}
        </legend>
      </fieldset>
      {renderInputSubtitle()}
    </div>
  );
}
