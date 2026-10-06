import { useId, useState } from "react";
import { HiArrowUpLeft, HiEnvelope, HiGlobeAlt, HiUser } from "react-icons/hi2";
import { FaFacebook, FaGithub, FaGitlab, FaInstagram, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { StaffRole, type StaffModel } from "../../models/StaffModel";
import { getStaffContacts, staffRoleLabel } from "./staff.adapter";

const socialIcons = {
  linkedin: FaLinkedin, github: FaGithub, gitlab: FaGitlab,
  instagram: FaInstagram, telegram: FaTelegramPlane,
  twitter: FaXTwitter, facebook: FaFacebook, email: HiEnvelope, website: HiGlobeAlt,
};

const StaffCard = ({ member }: { member: StaffModel }) => {
  const titleId = useId();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const contacts = getStaffContacts(member);
  const isLead = member.role === StaffRole.HEAD || member.role === StaffRole.DIRECTOR;
  const quote = typeof member.quote === "string" ? member.quote.trim() : "";
  const hasQuote = quote.length > 0 && !/^[-–—]+$/.test(quote);
  return (
    <article aria-labelledby={titleId} data-lead={isLead} className={`staff-card flex h-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white text-primary ${isLead ? "border-primary/40" : "border-primary/15"}`}>
      <div className={`flex items-center gap-4 p-5 sm:p-6 ${isLead ? "bg-primary text-text-white" : ""}`}>
        <div className="relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-indigo/20">
          {member.image && failedImage !== member.image ? (
            <img src={member.image} alt={`تصویر ${member.name}`} loading="lazy" onError={() => setFailedImage(member.image)} className="size-full object-cover object-[center_35%]" />
          ) : <HiUser aria-hidden="true" className="size-12 text-dark-gray" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 id={titleId} dir="auto" className="break-words text-xl font-bold leading-8">{member.name}</h3>
          <p dir="auto" className={`mt-2 break-words text-sm leading-7 ${isLead ? "text-indigo" : "text-dark-gray"}`}>{staffRoleLabel(member)}</p>
          {isLead && <span className="mt-3 inline-flex rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-primary">{member.role === StaffRole.DIRECTOR ? "دبیر جشنواره" : "سرپرست تیم"}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 pb-3 sm:px-6">
        {hasQuote && (
          <blockquote className={`mb-4 flex items-start gap-3 rounded-lg bg-primary/5 px-4 py-3 ${isLead ? "mt-5" : ""}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="mt-1.5 size-5 shrink-0 text-orange-ink"><path d="M10 5H3v7h3c0 3-1 4-3 5v2c5-1 7-4 7-9V5Zm11 0h-7v7h3c0 3-1 4-3 5v2c5-1 7-4 7-9V5Z" /></svg>
            <p dir="auto" className="min-w-0 flex-1 whitespace-pre-line break-words text-base leading-8 text-dark-gray">{quote}</p>
          </blockquote>
        )}
        {contacts.length > 0 && (
          <div role="group" aria-label={`راه‌های ارتباط با ${member.name}`} className={`mt-auto flex min-w-0 flex-wrap gap-x-4 gap-y-1 py-1 text-dark-gray ${isLead && !hasQuote ? "pt-3" : ""}`}>
            {contacts.map(contact => {
              const email = contact.platform === "email";
              const Icon = socialIcons[contact.platform as keyof typeof socialIcons] ?? HiGlobeAlt;
              return (
                <a key={contact.href} href={contact.href} target={email ? undefined : "_blank"} rel={email ? undefined : "noopener noreferrer"}
                  aria-label={`${email ? "ایمیل" : contact.label} ${member.name}${email ? `: ${contact.label}` : " (در پنجره جدید)"}`}
                  className="inline-flex min-h-11 min-w-0 max-w-full items-center gap-2 rounded-lg py-2 text-sm font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                  <span dir="auto" className="min-w-0 break-all">{contact.label}</span>
                  {!email && <HiArrowUpLeft aria-hidden="true" className="size-3.5 shrink-0" />}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default StaffCard;
