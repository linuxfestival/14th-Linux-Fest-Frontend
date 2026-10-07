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
          className={`inline-flex max-w-full items-center gap-1.5 rounded-md px-2.5 py-1 text-xs leading-5 ${Icon ? "font-extrabold" : "font-bold"} ${color}`}
        >
          {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
          <span className="min-w-0 break-words">{tag}</span>
        </span>
      );
    })}
  </div>
);

export default PresentationTags;
