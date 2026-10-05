interface CalendarPresentation {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

const calendarDate = (date: Date) =>
  date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export const createGoogleCalendarUrl = (presentation: CalendarPresentation) => {
  const { id, title, start, end } = presentation;
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start)
    throw new RangeError("Presentation must have a valid start and end time");

  const url = new URL("https://calendar.google.com/calendar/render");
  url.search = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${calendarDate(start)}/${calendarDate(end)}`,
    ctz: "Asia/Tehran",
    details: `جزئیات ارائه در لینوکس‌فست:\nhttps://linux-fest.ir/workshop/${id}`,
  }).toString();
  return url.toString();
};
