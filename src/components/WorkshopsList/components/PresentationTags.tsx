import { HiMapPin, HiVideoCamera } from "react-icons/hi2";
import { FaMugHot } from "react-icons/fa6";

interface Props {
  tags: string[];
  featured?: boolean;
}

const PresentationTags = ({ tags, featured = false }: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {tags.map((tag) => {
      const online = tag === "Online";
      const inPerson = tag === "In-Person";
      const breakfast = /^(breakfast|breackfast)\s+included$/i.test(tag.trim());
      const Icon = breakfast
        ? FaMugHot
        : online
          ? HiVideoCamera
          : inPerson
            ? HiMapPin
            : null;
      const color = breakfast
        ? "bg-dark-gray text-white"
        : online
          ? "bg-indigo text-primary"
          : inPerson
            ? "bg-secondary text-primary"
            : featured
              ? "bg-indigo/30 text-text-white"
              : "bg-indigo/35 text-primary";

      return (
        <span
          key={tag}
          dir="auto"
          className={`inline-flex max-w-full items-center gap-1.5 rounded-md leading-5 ${breakfast ? "px-3 py-1.5 text-sm font-black" : `px-2.5 py-1 text-xs ${Icon ? "font-extrabold" : "font-bold"}`} ${color}`}
        >
          {Icon && (
            <Icon
              className={`${breakfast ? "size-5" : "size-4"} shrink-0`}
              aria-hidden="true"
            />
          )}
          <span className="min-w-0 break-words">
            {breakfast ? "به همراه صبحانه" : tag}
          </span>
        </span>
      );
    })}
  </div>
);

export default PresentationTags;
