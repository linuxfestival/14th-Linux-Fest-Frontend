export const digitsToPersian = (input: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return input.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const digitsToLatin = (input: string): string => {
  const latinDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return input.replace(
    /[۰-۹]/g,
    (digit) => latinDigits[digit.charCodeAt(0) - 1776]
  );
};

export function convertAndFormatToPersian(
  input: string,
  splitter: string = ","
): string {
  return digitsToPersian(parseInt(input, 10).toLocaleString("en-US")).replace(
    /,/g,
    splitter
  );
}
