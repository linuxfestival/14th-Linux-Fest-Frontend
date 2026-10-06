import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import type { StaffModel } from "../../models/StaffModel";
import { makeCall } from "../../utils/makeCall";
import StaffCard from "./StaffCard";
import { groupStaff } from "./staff.adapter";
import { HiAcademicCap, HiCodeBracket, HiMegaphone, HiPaintBrush, HiCamera, HiUserGroup, HiSparkles, HiStar } from "react-icons/hi2";

const teamIcons = {
  SCIENTIFIC: HiAcademicCap, TECHNICAL: HiCodeBracket, GRAPHICS: HiPaintBrush,
  MARKETING: HiMegaphone, EXECUTIVE: HiUserGroup, MEDIA: HiCamera,
  DECORATION: HiSparkles, DIRECTOR: HiStar,
};

const getStaff = makeCall<void, StaffModel[]>("/api/staff/", "GET");

const Staff = () => {
  const [staff, setStaff] = useState<StaffModel[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const groups = groupStaff(staff);

  useEffect(() => {
    let active = true;
    void getStaff().then(response => {
      if (!active) return;
      setStaff(response.data);
      setLoadState("ready");
    }).catch(() => {
      if (active) setLoadState("error");
    });
    return () => { active = false; };
  }, [retry]);

  return (
    <div className="flex min-h-dvh flex-col bg-text-white text-primary" dir="rtl">
      <Helmet><title>لینوکس‌فست | دست‌اندرکاران</title></Helmet>
      <Header />
      <main className="mx-auto min-h-[70dvh] w-full max-w-7xl flex-1 px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10">
        <div className="mb-12 border-b border-primary/15 pb-8 sm:mb-14">
          <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl">دست‌اندرکاران</h1>
          <p className="mt-3 text-base leading-8 text-dark-gray">با تیم برگزاری لینوکس‌فست آشنا شوید.</p>
          {loadState === "ready" && groups.length > 1 && (
            <nav aria-label="تیم‌های برگزاری" className="mt-6 flex flex-wrap gap-2">
              {groups.map(group => (
                <a key={group.team} href={`#team-${encodeURIComponent(group.team)}`} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-primary/15 px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:bg-primary hover:text-text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  {group.title}<span className="text-xs font-normal tabular-nums">{group.members.length.toLocaleString("fa-IR")}</span>
                </a>
              ))}
            </nav>
          )}
        </div>
        {loadState === "loading" ? (
          <div role="status" aria-label="در حال دریافت دست‌اندرکاران">
            <span className="sr-only">در حال دریافت دست‌اندرکاران…</span>
            <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(index => (
                <div key={index} className="rounded-xl border border-primary/15 bg-white p-6">
                  <div className="flex items-center gap-4"><div className="h-28 w-24 shrink-0 rounded-lg bg-indigo/20 motion-safe:animate-pulse" /><div className="flex-1 space-y-3"><div className="h-5 w-3/4 rounded bg-primary/10 motion-safe:animate-pulse" /><div className="h-4 w-2/3 rounded bg-primary/5 motion-safe:animate-pulse" /></div></div>
                </div>
              ))}
            </div>
          </div>
        ) : loadState === "error" ? (
          <div role="alert" className="rounded-xl border border-primary/15 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold">دریافت دست‌اندرکاران انجام نشد.</h2>
            <p className="mt-3 text-sm leading-7 text-dark-gray">اتصال اینترنت را بررسی کن و دوباره تلاش کن.</p>
            <button type="button" onClick={() => { setLoadState("loading"); setRetry(value => value + 1); }}
              className="mt-5 min-h-11 rounded-lg bg-secondary px-5 py-3 text-sm font-bold text-primary hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">تلاش دوباره</button>
          </div>
        ) : !staff.length ? (
          <p className="rounded-xl border border-primary/15 bg-white p-6 text-sm leading-7 text-dark-gray sm:p-8">هنوز اطلاعات دست‌اندرکاران منتشر نشده است.</p>
        ) : (
          <div className="space-y-14 sm:space-y-16">
            {groups.map(group => {
              const Icon = teamIcons[group.team as keyof typeof teamIcons] ?? HiUserGroup;
              return (
              <section key={group.team} aria-labelledby={`team-${encodeURIComponent(group.team)}`}>
                <div className="mb-6 flex items-center gap-3">
                  <Icon aria-hidden="true" className="size-7 shrink-0 text-orange-ink" />
                  <h2 id={`team-${encodeURIComponent(group.team)}`} className="scroll-mt-32 break-words text-2xl font-extrabold">{group.title}</h2>
                  <div aria-hidden="true" className="ms-2 h-px flex-1 bg-primary/15" />
                </div>
                <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map(member => <StaffCard key={member.id} member={member} />)}
                </div>
              </section>
            );})}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Staff;
