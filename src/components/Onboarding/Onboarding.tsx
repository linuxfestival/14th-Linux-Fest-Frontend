import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

import Button from "../Common/Button/Button";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOnboarding()
      .then(({ data }) => {
        if (!data.is_first_login) {
          router.navigate("/");
          return;
        }
        setSource(data.heard_about_us || "");
        setUniversity(data.university || "");
        setConsent(data.hamkaran_announcement_consent);
      })
      .catch(() => toast.error("دریافت اطلاعات اولیه ناموفق بود."))
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!source) {
      toast.error("لطفاً نحوه آشنایی با جشنواره را انتخاب کنید.");
      return;
    }
    setLoading(true);
    try {
      await saveOnboarding({
        heard_about_us: source,
        university,
        hamkaran_announcement_consent: consent,
      });
      toast.success("اطلاعات شما ثبت شد.");
      await router.navigate("/");
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      toast.error(detail || "ثبت اطلاعات ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-pattern flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-xl rounded-4xl bg-[#101010ee] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">خوش آمدید!</h1>
        <p className="mt-3 mb-8 text-gray-300">
          برای کامل‌شدن ورود، لطفاً به چند سؤال کوتاه پاسخ دهید.
        </p>
        <div className="flex flex-col gap-5 text-white">
          <label className="flex flex-col gap-2">
            <span>چطور با لینوکس‌فست آشنا شدید؟</span>
            <select
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className="rounded-xl border border-secondary-gray bg-[#181818] p-3"
            >
              <option value="">انتخاب کنید</option>
              {sources.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>دانشگاه (اختیاری)</span>
            <input
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              className="rounded-xl border border-secondary-gray bg-transparent p-3 outline-none"
              placeholder="نام دانشگاه"
            />
          </label>
          <label className="flex items-start gap-3 text-gray-200">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 size-4"
            />
            مایل هستم اطلاع‌رسانی‌های همکاران سیستم را دریافت کنم.
          </label>
          <Button loading={loading} onClick={submit} className="w-full">
            ثبت و ادامه
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
