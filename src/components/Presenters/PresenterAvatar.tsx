import { useState } from "react";
import { HiUser } from "react-icons/hi2";

const PresenterAvatar = ({ avatar, name, className = "" }: { avatar: string; name: string; className?: string }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e1eff8] ${className}`}>
      <HiUser aria-hidden="true" className="size-1/2 text-dark-gray" />
      {avatar && !failed && <img src={avatar} alt={`تصویر ${name}`} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover" />}
    </div>
  );
};

export default PresenterAvatar;
