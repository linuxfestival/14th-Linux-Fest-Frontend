import { Link } from "react-router-dom";
import { HiArrowLeft, HiCalendarDays } from "react-icons/hi2";
import fallback from "../../../../assets/images/terminal.png";

import { dateText, secondaryActionClass } from "../../dashboard.styles";
import { createGoogleCalendarUrl } from "../../../../utils/presentationCalendar";
const RegisteredWorkshop = ({
  id,
  title,
  time,
  end,
  image,
}: {
  id: number;
  title: string;
  time: Date;
  end: Date;
  image?: string;
}) => {
  const now = Date.now();
  const upcoming = now < time.getTime();
  const live = !upcoming && now <= end.getTime();
  const hasSchedule = Number.isFinite(time.getTime()) && Number.isFinite(end.getTime()) && end > time;
  const calendarUrl = hasSchedule
    ? createGoogleCalendarUrl({ id, title, start: time, end })
    : undefined;
  return (
    <article className="flex min-w-0 flex-col gap-5 rounded-xl border border-primary/15 bg-white p-5 sm:flex-row sm:items-center">
      <img
        src={image || fallback}
        alt=""
        onError={(event) => {
          event.currentTarget.src = fallback;
        }}
        className="h-36 w-full rounded-lg bg-indigo/15 object-contain sm:size-24"
      />
      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${live ? "bg-green-50 text-green-800" : "bg-indigo/15 text-dark-gray"}`}
        >
          {upcoming ? "پیش رو" : live ? "در حال برگزاری" : "برگزار شده"}
        </span>
        <h2 className="mt-3 break-words text-lg font-bold">{title}</h2>
        <p className="mt-2 flex items-start gap-2 text-xs leading-6 text-dark-gray">
          <HiCalendarDays aria-hidden="true" className="mt-1 size-4 shrink-0" />
          {dateText(time)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <Link
          to={`/workshop/${id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold text-orange-ink hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-primary"
        >
          جزئیات ارائه
          <HiArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${secondaryActionClass} aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
          aria-disabled={!hasSchedule || undefined}
          tabIndex={hasSchedule ? undefined : -1}
          aria-label={`افزودن ${title} به تقویم گوگل (در پنجره جدید)`}
        >
          <HiCalendarDays aria-hidden="true" className="size-4 shrink-0" />
          افزودن به تقویم گوگل
        </a>
      </div>
    </article>
  );
};
export default RegisteredWorkshop;
