import { HiCheck } from "react-icons/hi2";

import { priceText } from "../../dashboard.styles";
const SelectableCard = ({
  title,
  description,
  active,
  image,
  onClick,
  price,
}: {
  title: string;
  description?: string;
  active: boolean;
  image: string;
  onClick: () => void;
  price?: number;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`flex w-full items-start gap-4 rounded-lg border p-4 text-right focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-secondary bg-secondary/10" : "border-primary/20 hover:bg-indigo/10"}`}
  >
    <img
      src={image}
      alt=""
      className="size-14 shrink-0 rounded-md object-contain"
    />
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-bold">{title}</span>
      {description && (
        <span className="mt-1 block text-xs leading-6 text-dark-gray">
          {description}
        </span>
      )}
      {price !== undefined && (
        <span className="mt-2 block text-sm font-bold">
          {priceText(price)} تومان
        </span>
      )}
    </span>
    <span
      className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded border ${active ? "border-secondary bg-secondary text-primary" : "border-primary/30"}`}
    >
      {active && <HiCheck aria-hidden="true" className="size-4" />}
    </span>
  </button>
);
export default SelectableCard;
