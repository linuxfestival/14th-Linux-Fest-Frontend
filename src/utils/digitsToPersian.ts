export const digitsToPersian = (input: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return input.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export function convertAndFormatToPersian(input: string, splitter: string = ","): string {
  return digitsToPersian(
      parseInt(input, 10).toLocaleString("en-US")
  ).replace(/,/g, splitter);
}
