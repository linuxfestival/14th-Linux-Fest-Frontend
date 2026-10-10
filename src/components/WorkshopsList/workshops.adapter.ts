import {
  PresentationService,
  type PresentationDto,
} from "../../core/presentations/presentations.dto";
import Terminal from "../../assets/images/terminal.png";
import Microphone from "../../assets/images/mic.png";

export interface WorkshopItem {
  id: number;
  title: string;
  englishTitle: string;
  description: string;
  service: PresentationService;
  start: string;
  day: string;
  dateLabel: string;
  time: string;
  presenter: string;
  presenters: { name: string; avatar: string }[];
  price: number;
  remaining: number;
  registrationActive: boolean;
  level: string;
  tags: string[];
  image: string;
  hasArtwork: boolean;
  imageAlt: string;
  imageTone: string;
}

const stripHtml = (html: string) => {
  const document = new DOMParser().parseFromString(html, "text/html");
  return document.body.textContent?.trim() ?? "";
};

export const toWorkshopItem = (item: PresentationDto): WorkshopItem => {
  const start = new Date(item.start);
  const end = new Date(item.end);
  const timeZone = "Asia/Tehran";
  const timeFormat = new Intl.DateTimeFormat("fa-IR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    id: item.id,
    title: item.fa_title || item.en_title,
    englishTitle: item.en_title,
    description: stripHtml(item.fa_description || item.en_description),
    service: item.service_type,
    start: start.toISOString(),
    day: new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(start),
    dateLabel: new Intl.DateTimeFormat("fa-IR", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(start),
    time: `${timeFormat.format(start)} تا ${timeFormat.format(end)}`,
    presenter: item.presenters
      .map((presenter) => `${presenter.first_name} ${presenter.last_name}`)
      .join("، "),
    presenters: item.presenters.map((presenter) => ({
      name: `${presenter.first_name} ${presenter.last_name}`,
      avatar: presenter.avatar,
    })),
    price: item.cost,
    remaining: item.remained_capacity,
    registrationActive: item.is_registration_active,
    level: item.service_type === PresentationService.PACKAGE ? "پکیج" : "",
    tags: item.tags.map((tag) => tag.name),
    image:
      item.morkopoloyor ||
      (item.service_type === PresentationService.TALK ? Microphone : Terminal),
    imageAlt: `تصویر ارائه ${item.fa_title || item.en_title}`,
    hasArtwork: Boolean(item.morkopoloyor),
    imageTone: "bg-indigo/20",
  };
};
