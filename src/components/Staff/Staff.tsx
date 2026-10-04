import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import type { StaffModel } from "../../models/StaffModel";
import { makeCall } from "../../utils/makeCall";
import StaffCard from "./StaffCard";
import { groupStaff } from "./staff.adapter";

const getStaff = makeCall<void, StaffModel[]>("/api/staff/", "GET");

const Staff = () => {
  const [staff, setStaff] = useState<StaffModel[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

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
        <div className="mb-9 border-b border-primary/15 pb-7">
          <h1 className="text-3xl font-black leading-snug sm:text-4xl">دست‌اندرکاران</h1>
          <p className="mt-3 text-base leading-8 text-dark-gray">با تیم برگزاری لینوکس‌فست آشنا شوید.</p>
        </div>
        {loadState === "loading" ? (
          <div role="status" aria-label="در حال دریافت دست‌اندرکاران">
            <span className="sr-only">در حال دریافت دست‌اندرکاران…</span>
            <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(index => (
                <div key={index} className="overflow-hidden rounded-xl border border-primary/15 bg-white">
                  <div className="flex h-48 items-center justify-center bg-indigo/20"><div className="size-28 rounded-full bg-primary/10 motion-safe:animate-pulse" /></div>
                  <div className="space-y-4 p-6"><div className="h-5 w-2/3 rounded bg-primary/10 motion-safe:animate-pulse" /><div className="h-4 w-1/2 rounded bg-primary/5 motion-safe:animate-pulse" /></div>
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
          <div className="space-y-12">
            {groupStaff(staff).map(group => (
              <section key={group.team} aria-labelledby={`team-${encodeURIComponent(group.team)}`}>
                <h2 id={`team-${encodeURIComponent(group.team)}`} className="mb-5 break-words text-xl font-extrabold sm:text-2xl">{group.title}</h2>
                <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map(member => <StaffCard key={member.id} member={member} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Staff;
