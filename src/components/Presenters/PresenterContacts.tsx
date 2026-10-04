import { HiEnvelope, HiArrowUpLeft } from "react-icons/hi2";
import { FaLinkedin } from "react-icons/fa";

const PresenterContacts = ({ email, linkedin, name }: { email?: string; linkedin?: string; name: string }) => {
  const address = email?.trim();
  const profile = linkedin?.trim();
  if (!address && !profile) return null;

  return (
    <div className="flex min-w-0 flex-col gap-2" role="group" aria-label={`راه‌های ارتباط با ${name}`}>
      {address && <a href={`mailto:${address}`} aria-label={`ارسال ایمیل به ${name}: ${address}`} className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-gray transition-colors hover:bg-indigo/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><HiEnvelope aria-hidden="true" className="size-5 shrink-0" /><span dir="ltr" className="min-w-0 break-all">{address}</span></a>}
      {profile && <a href={profile} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-dark-gray transition-colors hover:bg-indigo/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><FaLinkedin aria-hidden="true" className="size-5 shrink-0" />پروفایل لینکدین<HiArrowUpLeft aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only"> (در پنجره جدید)</span></a>}
    </div>
  );
};

export default PresenterContacts;
