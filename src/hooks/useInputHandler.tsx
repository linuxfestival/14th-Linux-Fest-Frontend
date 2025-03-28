import { useState } from "react";
import { digitsToLatin, digitsToPersian } from "../utils/digitsToPersian";

type Validator = (value: string) => string | undefined;

export enum GeneralErrors {
  MinimumLength = "MinimumLength",
  MaximumLength = "MaximumLength",
  FixedLength = "FixedLength",
  MinimumAmount = "MinimumAmount",
  MaximumAmount = "MaximumAmount",
  Required = "Required",
  RegexMatch = "RegexMatch",
  ExcludeWithRegex = "ExcludeRegex",
}

export const GeneralValidators = {
  minLength: (minimumLength: number) => {
    return (value: string) =>
      value.length < minimumLength ? GeneralErrors.MinimumLength : undefined;
  },
  maxLength: (maximumLength: number) => {
    return (value: string) =>
      value.length > maximumLength ? GeneralErrors.MaximumLength : undefined;
  },
  fixedLength: (fixedLength: number) => {
    return (value: string) =>
      value.length !== fixedLength ? GeneralErrors.FixedLength : undefined;
  },
  minAmount: (minimumAmount: number) => {
    return (value: string) =>
      parseInt(value) < minimumAmount ? GeneralErrors.MinimumAmount : undefined;
  },
  maxAmount: (maximumAmount: number) => {
    return (value: string) =>
      parseInt(value) > maximumAmount ? GeneralErrors.MaximumAmount : undefined;
  },
  required: (value: string) => {
    return !value.trim() ? GeneralErrors.Required : undefined;
  },
  regexMatch: (regex: RegExp) => {
    return (value: string) =>
      !regex.test(value) ? GeneralErrors.RegexMatch : undefined;
  },
  excludeWithRegex: (regex: RegExp) => {
    return (value: string) =>
      regex.test(value) ? GeneralErrors.ExcludeWithRegex : undefined;
  },
};

interface Options {
  initialValue?: string;
  beforeChange?: (value: string) => string;
  beforeBlur?: (value: string) => boolean | void;
  beforeFocus?: (value: string) => boolean | void;
  validators?: Validator[];
  errorMessages?: { [key: string]: string };
  formatter?: (value: string) => string;
  numberOnly?: boolean;
  persianDigits?: boolean;
  realTimeValidation?: boolean;
  maxLength?: number;
}

interface Output {
  value: string;
  errorText: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  setValue: (value: string) => void;
  setErrorText: (value: string | undefined) => void;
  required: boolean;
  rawValue: string;
  valid: boolean;
  validate: () => boolean;
}

const useInputHandler = (options: Options) => {
  const [value, setValue] = useState(options.initialValue ?? "");
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const validate = () => {
    if (!options.validators) return;
    let err;
    for (const validator of options.validators) {
      err = validator(value);
      if (err) {
        setErrorText(options.errorMessages?.[err]);
        return false;
      }
    }
    setErrorText(undefined);
    return true;
  };

  const format = (text: string) => {
    text = options.formatter?.(text) ?? text;
    if (options.persianDigits) {
      text = digitsToPersian(text);
    }
    return text;
  };

  const unformed = (text: string) => {
    if (options.persianDigits) {
      text = digitsToLatin(text);
    }
    return options.beforeChange?.(text) ?? text;
  };

  const onChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    const plainText = unformed(value.target.value);
    if (options.maxLength && plainText.length > options.maxLength) return;
    if (options.numberOnly && !/^\d*$/.test(plainText)) return;
    if (options.realTimeValidation) {
      validate();
    } else {
      setErrorText(undefined);
    }
    setValue(plainText);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (options.beforeBlur?.(value)) return;
    validate();
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (options.beforeFocus?.(value)) return;
  };

  return {
    value: format(value),
    errorText,
    onChange,
    onBlur,
    onFocus,
    setValue,
    setErrorText,
    rawValue: value,
    valid: errorText === undefined,
    required: options.validators?.includes(GeneralValidators.required) ?? false,
    validate,
  };
};

export default useInputHandler;
