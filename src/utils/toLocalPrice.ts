export function toLocalPrice(price: number): string {
  if (price >= 1_000_000) {
    const millions = Math.floor(price / 1_000_000);
    return `${millions} میلیون`;
  } else if (price >= 1_000) {
    const thousands = Math.floor(price / 1_000);
    return `${thousands} هزار`;
  } else {
    return `${price}`;
  }
}
