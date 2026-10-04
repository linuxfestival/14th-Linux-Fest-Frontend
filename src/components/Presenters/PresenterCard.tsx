import { useId, useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import PresenterModal from "./PresenterModal";
import PresenterAvatar from "./PresenterAvatar";
import PresenterContacts from "./PresenterContacts";

export interface PresenterCardProps {
  avatar: string;
  name: string;
  description: string;
  email?: string;
  linkedin?: string;
}

export const PresenterCard = ({ avatar, name, description, email, linkedin }: PresenterCardProps) => {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const excerpt = new DOMParser().parseFromString(description, "text/html").body.textContent?.trim();

  return (
    <article aria-labelledby={titleId} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-primary/15 bg-white">
      <div className="flex h-48 items-center justify-center bg-indigo/20">
        <PresenterAvatar key={avatar} avatar={avatar} name={name} className="size-28 ring-4 ring-white sm:size-32" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 id={titleId} dir="auto" className="break-words text-xl font-extrabold leading-8">{name}</h2>
        <p dir="auto" className="mt-3 line-clamp-2 break-words text-sm leading-7 text-dark-gray">{excerpt || "برای آشنایی بیشتر، پروفایل ارائه‌دهنده را ببین."}</p>
        {(email?.trim() || linkedin?.trim()) && <div className="mt-2"><PresenterContacts email={email} linkedin={linkedin} name={name} /></div>}
        <div className="mt-auto pt-6">
          <div className="border-t border-primary/15 pt-4">
          <button type="button" aria-haspopup="dialog" aria-label={`اطلاعات بیشتر درباره ${name}`} onClick={() => setOpen(true)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg bg-text-white px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-indigo/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">اطلاعات بیشتر<HiArrowLeft aria-hidden="true" className="size-4" /></button>
          </div>
        </div>
      </div>
      {open && <PresenterModal avatar={avatar} name={name} description={description} email={email} linkedin={linkedin} onClose={() => setOpen(false)} />}
    </article>
  );
};
