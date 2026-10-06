import { HiMapPin, HiVideoCamera } from "react-icons/hi2";

interface Props {
  tags: string[];
  featured?: boolean;
}

const PresentationTags = ({ tags, featured = false }: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {tags.map((tag) => {
      const online = tag === "Online";
      const inPerson = tag === "In-Person";
      const Icon = online ? HiVideoCamera : inPerson ? HiMapPin : null;
      const color = online
        ? featured
          ? "bg-indigo text-primary"
          : "bg-indigo/20 text-dark-gray"
        : inPerson
          ? featured
            ? "bg-secondary text-primary"
            : "bg-secondary/15 text-orange-ink"
          : featured
            ? "bg-indigo/15 text-text-gray"
            : "bg-text-white text-dark-gray";

      return (
        <span
          key={tag}
          dir="auto"
          className={`inline-flex max-w-full items-center gap-1.5 rounded-md px-2.5 py-1 text-xs leading-5 ${Icon ? "font-extrabold" : "font-medium"} ${color}`}
        >
          {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
          <span className="min-w-0 break-words">{tag}</span>
        </span>
      );
    })}
  </div>
);

export default PresentationTags;
