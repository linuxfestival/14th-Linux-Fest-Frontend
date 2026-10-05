import { useId, useState, type InputHTMLAttributes } from "react";
import { HiEye, HiEyeSlash, HiExclamationCircle } from "react-icons/hi2";

interface Props extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "name"
  | "value"
  | "placeholder"
  | "autoComplete"
  | "inputMode"
  | "required"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "maxLength"
> {
  label: string;
  errorText?: string;
  hint?: string;
  direction?: "ltr" | "rtl";
}

const AuthField = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  autoComplete,
  inputMode,
  required,
  onChange,
  onBlur,
  onFocus,
  maxLength,
  errorText,
  hint,
  direction = "rtl",
}: Props) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          value={value}
          type={password && visible ? "text" : type}
          dir={direction}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={!!errorText}
          aria-describedby={
            errorText ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`h-12 w-full min-w-0 rounded-lg border bg-text-white px-4 text-base text-primary caret-primary placeholder:text-dark-gray/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${errorText ? "border-ubuntu-red" : "border-primary/20"} ${password ? "pr-12" : ""}`}
        />
        {password && (
          <button
            type="button"
            aria-label={`${visible ? "پنهان کردن" : "نمایش"} ${label}`}
            aria-pressed={visible}
            onClick={() => setVisible((value) => !value)}
            className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-md text-dark-gray hover:bg-indigo/20 focus-visible:outline-2 focus-visible:outline-primary"
          >
            {visible ? (
              <HiEyeSlash aria-hidden="true" className="size-5" />
            ) : (
              <HiEye aria-hidden="true" className="size-5" />
            )}
          </button>
        )}
      </div>
      {errorText ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-start gap-2 text-xs leading-6 text-ubuntu-red"
        >
          <HiExclamationCircle
            aria-hidden="true"
            className="mt-1 size-4 shrink-0"
          />
          {errorText}
        </p>
      ) : (
        hint && (
          <p
            id={`${id}-hint`}
            className="mt-2 text-xs leading-6 text-dark-gray"
          >
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default AuthField;
