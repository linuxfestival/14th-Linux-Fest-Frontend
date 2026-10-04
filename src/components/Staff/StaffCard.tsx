import { useId } from "react";
import { HiArrowUpLeft, HiEnvelope, HiGlobeAlt } from "react-icons/hi2";
import { FaFacebook, FaGithub, FaGitlab, FaInstagram, FaLinkedin, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { StaffModel } from "../../models/StaffModel";
import PresenterAvatar from "../Presenters/PresenterAvatar";
import { getStaffContacts, staffRoleLabel } from "./staff.adapter";

const socialIcons = {
  linkedin: FaLinkedin, github: FaGithub, gitlab: FaGitlab,
  instagram: FaInstagram, telegram: FaTelegramPlane,
  twitter: FaXTwitter, facebook: FaFacebook, email: HiEnvelope, website: HiGlobeAlt,
};

const StaffCard = ({ member }: { member: StaffModel }) => {
  const titleId = useId();
  const contacts = getStaffContacts(member);
  return (
    <article aria-labelledby={titleId} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-primary/15 bg-white">
      <div className="flex h-48 items-center justify-center bg-indigo/20">
        <PresenterAvatar key={member.image} avatar={member.image || ""} name={member.name} className="size-28 ring-4 ring-white sm:size-32" />
      </div>
      <div className="p-6">
        <h3 id={titleId} dir="auto" className="break-words text-xl font-extrabold leading-8">{member.name}</h3>
        <p dir="auto" className="mt-2 break-words text-sm leading-7 text-dark-gray">{staffRoleLabel(member)}</p>
        {contacts.length > 0 && (
          <div role="group" aria-label={`راه‌های ارتباط با ${member.name}`} className="mt-3 flex min-w-0 flex-wrap gap-x-3 gap-y-1">
            {contacts.map(contact => {
              const email = contact.platform === "email";
              const Icon = socialIcons[contact.platform as keyof typeof socialIcons] ?? HiGlobeAlt;
              return (
                <a key={contact.href} href={contact.href} target={email ? undefined : "_blank"} rel={email ? undefined : "noopener noreferrer"}
                  aria-label={`${email ? "ایمیل" : contact.label} ${member.name}${email ? `: ${contact.label}` : " (در پنجره جدید)"}`}
                  className="inline-flex min-h-11 min-w-0 max-w-full items-center gap-2 rounded-lg py-2 text-sm font-bold text-dark-gray underline-offset-4 hover:text-orange-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
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
