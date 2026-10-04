import { useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { HiChevronDown, HiExclamationCircle } from "react-icons/hi2";

import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";
import AuthSubmit from "../Auth/AuthSubmit";
import { getOnboarding, saveOnboarding } from "../../core/auth/auth.api";
import router from "../../routes";

const sources = [
  ["telegram", "تلگرام"],
  ["instagram", "اینستاگرام"],
  ["linkedin", "لینکدین"],
  ["friends", "دوستان و آشنایان"],
  ["university", "دانشگاه یا پوستر"],
  ["hamkaran", "همکاران سیستم"],
  ["website", "وب‌سایت یا موتور جستجو"],
  ["other", "سایر"],
];

const Onboarding = () => {
  const [source, setSource] = useState("");
  const [university, setUniversity] = useState("");
  const [consent, setConsent] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const [sourceError, setSourceError] = useState("");
  const [saveError, setSaveError] = useState("");
  const sourceRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    let active = true;
    getOnboarding()
      .then(({ data }) => {
        if (!active) return;
        if (!data.is_first_login) {
          void router.navigate("/");
          return;
        }
        setSource(data.heard_about_us || "");
        setUniversity(data.university || "");
        setConsent(data.hamkaran_announcement_consent);
        setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("error");
      });
    return () => {
      active = false;
    };
  }, [retry]);

  const submit = async () => {
    if (saving || loadState !== "ready") return;
    if (!source) {
      setSourceError("لطفاً نحوه آشنایی با جشنواره را انتخاب کنید.");
      sourceRef.current?.focus();
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      await saveOnboarding({
        heard_about_us: source,
        university,
        hamkaran_announcement_consent: consent,
      });
      toast.success("اطلاعات شما ثبت شد.");
      await router.navigate("/");
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data
        ?.detail;
      setSaveError(detail || "ثبت اطلاعات ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout
      title="تکمیل اطلاعات"
      description="برای کامل‌شدن ورود، لطفاً به چند سؤال کوتاه پاسخ دهید."
    >
      {loadState === "loading" ? (
        <div
          role="status"
          className="flex min-h-44 items-center justify-center gap-3 text-sm text-dark-gray"
        >
          <span
            aria-hidden="true"
            className="size-5 rounded-full border-2 border-primary/20 border-t-primary motion-safe:animate-spin"
          />
          در حال دریافت اطلاعات…
        </div>
      ) : loadState === "error" ? (
        <div className="py-6">
          <p
            role="alert"
            className="flex items-start gap-2 text-sm leading-7 text-ubuntu-red"
          >
            <HiExclamationCircle
              aria-hidden="true"
              className="mt-1 size-5 shrink-0"
            />
            دریافت اطلاعات اولیه ناموفق بود. دوباره تلاش کنید.
          </p>
          <button
            type="button"
            onClick={() => {
              setLoadState("loading");
              setRetry((value) => value + 1);
            }}
            className="mt-5 min-h-11 cursor-pointer rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-dark-gray focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            تلاش دوباره
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <fieldset disabled={saving} className="space-y-6">
            <div>
              <label
                htmlFor="onboarding-source"
                className="mb-2 flex flex-wrap items-center gap-x-2 text-sm font-bold"
              >
                چطور با لینوکس‌فست آشنا شدید؟
                <span className="text-xs font-normal text-dark-gray">
                  (الزامی)
                </span>
              </label>
              <div className="relative">
                <select
                  ref={sourceRef}
                  id="onboarding-source"
                  name="heard_about_us"
                  required
                  value={source}
                  onChange={(event) => {
                    setSource(event.target.value);
                    setSourceError("");
                  }}
                  aria-invalid={!!sourceError}
                  aria-describedby={
                    sourceError ? "onboarding-source-error" : undefined
                  }
                  className={`h-12 w-full min-w-0 appearance-none rounded-lg border bg-text-white pl-11 pr-4 text-base text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${sourceError ? "border-ubuntu-red" : "border-primary/20"}`}
                >
                  <option value="">انتخاب کنید</option>
                  {sources.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <HiChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-4 size-4 text-dark-gray"
                />
              </div>
              {sourceError && (
                <p
                  id="onboarding-source-error"
                  role="alert"
                  className="mt-2 flex items-start gap-2 text-xs leading-6 text-ubuntu-red"
                >
                  <HiExclamationCircle
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0"
                  />
                  {sourceError}
                </p>
              )}
            </div>
            <AuthField
              name="university"
              label="دانشگاه (اختیاری)"
              placeholder="نام دانشگاه"
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              autoComplete="organization"
            />
            <div className="border-t border-primary/15 pt-5">
              <h2 className="text-sm font-bold">اطلاع‌رسانی همکاران سیستم</h2>
              <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-7">
                <input
                  type="checkbox"
                  name="hamkaran_announcement_consent"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  aria-describedby="onboarding-consent-hint"
                  className="mt-1 size-5 shrink-0 cursor-pointer rounded accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                />
                مایل هستم اطلاع‌رسانی‌های همکاران سیستم را دریافت کنم. (اختیاری)
              </label>
            </div>
          </fieldset>
          {saveError && (
            <p role="alert" className="mt-4 text-sm leading-7 text-ubuntu-red">
              {saveError}
            </p>
          )}
          <div className="mt-6">
            <AuthSubmit loading={saving}>ثبت و ادامه</AuthSubmit>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default Onboarding;
