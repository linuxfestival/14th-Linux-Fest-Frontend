import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiArrowTopRightOnSquare, HiClipboardDocument, HiEye, HiEyeSlash, HiVideoCamera } from "react-icons/hi2";
import type { RootState } from "../../../store";
import { getSkyroomAccess, safeSkyroomUrl, type SkyroomAccess } from "../../../core/skyroom/skyroom.api";
import { DashboardEmpty, DashboardLoading, DashboardPage, DashboardPanel } from "../DashboardUI";
import { actionClass, dateText, secondaryActionClass } from "../dashboard.styles";

type AccessState =
  | { kind: "loading" }
  | { kind: "ready"; data: SkyroomAccess }
  | { kind: "empty" | "pending" | "error" | "unauthorized" };

export default function Skyroom() {
  const userPhoneNumber = useSelector((state: RootState) => state.auth.userPhoneNumber);
  const [state, setState] = useState<AccessState>({ kind: "loading" });
  const [retry, setRetry] = useState(0);
  const [visible, setVisible] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState("");

  useEffect(() => {
    let active = true;
    setState({ kind: "loading" });
    setVisible(false);
    setClipboardNotice("");
    void getSkyroomAccess().then(
      ({ data }) => {
        if (active) setState({ kind: "ready", data });
      },
      (error: unknown) => {
        if (!active) return;
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        setState({ kind: status === 404 ? "empty" : status === 503 ? "pending" : status === 401 ? "unauthorized" : "error" });
      },
    );
    return () => { active = false; };
  }, [userPhoneNumber, retry]);

  useEffect(() => {
    const hideWhenAway = () => { if (document.hidden) setVisible(false); };
    document.addEventListener("visibilitychange", hideWhenAway);
    return () => document.removeEventListener("visibilitychange", hideWhenAway);
  }, []);

  async function copy(value: string, label: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setClipboardNotice(`${label} کپی شد.`);
    } catch {
      setClipboardNotice("کپی خودکار انجام نشد. متن را انتخاب و کپی کنید.");
    }
  }

  const refresh = () => { setState({ kind: "loading" }); setRetry(value => value + 1); };

  return (
    <DashboardPage
      title="ورود به اسکای‌روم"
      description="اطلاعات ورود شما و لینک اتاق ارائه‌های آنلاین ثبت‌نام‌شده، همه در یک صفحه."
      action={<button type="button" className={secondaryActionClass} disabled={state.kind === "loading"} onClick={refresh}>به‌روزرسانی</button>}
    >
      {state.kind === "loading" ? <DashboardLoading text="در حال دریافت اطلاعات اسکای‌روم…" /> :
        state.kind === "empty" ? <DashboardPanel><DashboardEmpty
          title="هنوز دسترسی آنلاین فعالی ندارید"
          description="پس از تکمیل ثبت‌نام در ارائه‌های اسکای‌روم، اطلاعات ورود و لینک اتاق‌ها اینجا نمایش داده می‌شود."
        /></DashboardPanel> :
        state.kind === "unauthorized" ? <DashboardPanel>
          <p role="alert">برای مشاهده اطلاعات اسکای‌روم، دوباره وارد حساب خود شوید.</p>
          <Link to="/login" className={`${actionClass} mt-4`}>ورود به حساب</Link>
        </DashboardPanel> :
        state.kind !== "ready" ? <DashboardPanel>
          <h2 className="text-lg font-bold">{state.kind === "pending" ? "اطلاعات اسکای‌روم در حال آماده‌سازی است" : "دریافت اطلاعات ناموفق بود"}</h2>
          <p role={state.kind === "error" ? "alert" : "status"} className="mt-3 text-sm leading-7 text-dark-gray">
            {state.kind === "pending" ? "دسترسی اسکای‌روم به‌زودی آماده می‌شود. کمی بعد دوباره بررسی کنید." : "اتصال را بررسی کنید و دوباره تلاش کنید."}
          </p>
          <button type="button" className={`${secondaryActionClass} mt-4`} onClick={refresh}>تلاش دوباره</button>
        </DashboardPanel> : <>
          <DashboardPanel>
            <h2 className="text-lg font-bold">اطلاعات ورود شما</h2>
            <p className="mt-2 text-sm leading-7 text-dark-gray">این نام کاربری و رمز برای همه اتاق‌های اسکای‌روم شما یکسان است. رمز ورود سایت شما تغییر نکرده است.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="skyroom-username" className="mb-2 block text-sm font-bold">نام کاربری اسکای‌روم</label>
                <input id="skyroom-username" value={state.data.username} readOnly dir="ltr" autoComplete="off"
                  className="w-full min-w-0 rounded-lg border border-primary/20 bg-indigo/5 p-3 text-left font-mono text-base focus-visible:outline-2 focus-visible:outline-primary" />
                <button type="button" className={`${secondaryActionClass} mt-3`} onClick={() => void copy(state.data.username, "نام کاربری")}>
                  <HiClipboardDocument aria-hidden="true" className="size-5" />کپی نام کاربری
                </button>
              </div>
              <div className="min-w-0">
                <label htmlFor="skyroom-password" className="mb-2 block text-sm font-bold">رمز عبور اسکای‌روم</label>
                <input id="skyroom-password" type={visible ? "text" : "password"} value={state.data.password} readOnly dir="ltr" autoComplete="off"
                  className="w-full min-w-0 rounded-lg border border-primary/20 bg-indigo/5 p-3 text-left font-mono text-base focus-visible:outline-2 focus-visible:outline-primary" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className={secondaryActionClass} aria-controls="skyroom-password" aria-pressed={visible} onClick={() => setVisible(value => !value)}>
                    {visible ? <HiEyeSlash aria-hidden="true" className="size-5" /> : <HiEye aria-hidden="true" className="size-5" />}
                    {visible ? "پنهان کردن رمز" : "نمایش رمز"}
                  </button>
                  <button type="button" className={secondaryActionClass} onClick={() => void copy(state.data.password, "رمز عبور")}>
                    <HiClipboardDocument aria-hidden="true" className="size-5" />کپی رمز عبور
                  </button>
                </div>
              </div>
            </div>
            <p role="status" aria-live="polite" className="mt-4 min-h-6 text-sm text-dark-gray">{clipboardNotice}</p>
          </DashboardPanel>
          <section aria-labelledby="skyroom-rooms-title" className="space-y-4">
            <h2 id="skyroom-rooms-title" className="text-lg font-bold">اتاق‌های ارائه‌های شما</h2>
            {state.data.presentations.map(room => {
              const href = safeSkyroomUrl(room.room_url);
              const start = new Date(room.start);
              return <DashboardPanel key={room.id}>
                <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-base font-bold">{room.name}</h3>
                    {Number.isFinite(start.getTime()) && <p className="mt-2 text-sm text-dark-gray">{dateText(start)}</p>}
                    {!href && <p className="mt-2 text-sm leading-7 text-dark-gray">لینک اتاق هنوز تنظیم نشده است. بعداً این صفحه را به‌روزرسانی کنید.</p>}
                  </div>
                  {href ? <a href={href} target="_blank" rel="noopener noreferrer" className={actionClass}>
                    <HiArrowTopRightOnSquare aria-hidden="true" className="size-5" />ورود به اتاق
                  </a> : <button type="button" disabled className={actionClass}><HiVideoCamera aria-hidden="true" className="size-5" />لینک به‌زودی</button>}
                </div>
              </DashboardPanel>;
            })}
          </section>
        </>}
    </DashboardPage>
  );
}
