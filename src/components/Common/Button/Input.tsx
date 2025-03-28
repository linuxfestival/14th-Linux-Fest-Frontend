import clsx from "clsx";
import AlertIcon from "../icons/AlertIcon";
import SuccessIcon from "../icons/SuccessIcon";
import Loading from "../icons/Loading";

interface InputFieldProps {
  type: string;
  value: string;
  placeholder: string;
  label: string;
  textDirection?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  successText?: string;
  errorText?: string;
  autocomplete?: string;
  className?: string;
  labelClassName?: string;
  name?: string;
  loading?: boolean;
}

export default function InputField({ ...props }: InputFieldProps) {
  return (
    <div className={"flex flex-col w-full relative " + props.className}>
      <fieldset
        className={clsx("rounded-[14px] border-1", {
          ["border-[#F74455]"]: props.errorText,
          ["border-secondary-gray"]: !props.errorText,
        })}
      >
        {props.loading && (
          <Loading
            className="absolute left-1/2 -translate-x-1/2 animate-spin"
            width="25"
          />
        )}
        <input
          type={props.type}
          className="block px-2.5 pb-3 pt-1.5 w-full text-sm text-text-white bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
          placeholder={!props.loading ? props.placeholder : undefined}
          onChange={props.onChange}
          dir={props.textDirection}
          required={props.required}
          autoComplete={props?.autocomplete ?? ""}
          value={props.value}
          name={props.name}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
        />
        <legend
          className={clsx(
            "text-sm text-secondary-gray duration-300 px-1 mr-4 peer-focus:px-2 peer-placeholder-shown:scale-100"
          )}
        >
          {props.label}
        </legend>
      </fieldset>
      {props.errorText && (
        <div className="flex items-center gap-1 text-sm mt-1">
          <AlertIcon color="#F74455" size={16} />
          <div className="text-[#F74455]">{props.errorText}</div>
        </div>
      )}
    </div>
  );
}
