import { useState } from "react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../Common/Button/Button";
import InputField from "../Common/Button/Input";
import { resendActivation, verifyEmail } from "../../core/auth/auth.api";
import { initializeUser } from "../../core/auth/auth.slice";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler";
import router from "../../routes";
import { useAppDispatch } from "../../store";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const emailInput = useInputHandler({
    initialValue: params.get("email") ?? "",
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "ایمیل را وارد کنید.",
    },
  });
  const codeInput = useInputHandler({
    validators: [GV.required, GV.fixedLength(6)],
    errorMessages: {
      [GeneralErrors.Required]: "کد را وارد کنید.",
      [GeneralErrors.FixedLength]: "کد باید ۶ رقم باشد.",
    },
    numberOnly: true,
    persianDigits: true,
    maxLength: 6,
  });

  const submit = async () => {
    if (!emailInput.validate() || !codeInput.validate()) return;
    setLoading(true);
    try {
      const { data } = await verifyEmail({
        email: emailInput.rawValue,
        code: codeInput.rawValue,
      });
      Cookies.set("access_token", data.tokens.access, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refresh_token", data.tokens.refresh, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("phone_number", data.phone_number, {
        secure: true,
        sameSite: "Strict",
      });
      dispatch(initializeUser({
        ...data.tokens,
        phone_number: data.phone_number,
      }));
      toast.success("ایمیل شما تأیید شد.");
      await router.navigate(data.is_first_login ? "/onboarding" : "/");
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      toast.error(detail || "تأیید ایمیل ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!emailInput.validate()) return;
    setLoading(true);
    try {
      const { data } = await resendActivation({ email: emailInput.rawValue });
      toast.success(data.detail);
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      toast.error(detail || "ارسال دوباره کد ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-pattern flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg rounded-4xl bg-[#101010ee] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">تأیید ایمیل</h1>
        <p className="mt-3 mb-8 text-gray-300">
          کد ۶ رقمی ارسال‌شده به ایمیل خود را وارد کنید.
        </p>
        <div className="flex flex-col gap-5">
          <InputField
            type="email"
            placeholder="example@linux-fest.ir"
            label="ایمیل"
            autocomplete="email"
            {...emailInput}
          />
          <InputField
            type="text"
            placeholder="۱۲۳۴۵۶"
            label="کد تأیید"
            autocomplete="one-time-code"
            {...codeInput}
          />
          <Button loading={loading} onClick={submit} className="w-full">
            تأیید و ورود
          </Button>
          <button
            type="button"
            disabled={loading}
            onClick={resend}
            className="text-indigo disabled:text-gray-500 cursor-pointer"
          >
            ارسال دوباره کد
          </button>
          <Link to="/login" className="text-center text-gray-300">
            بازگشت به ورود
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
