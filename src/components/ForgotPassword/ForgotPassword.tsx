import { useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../Common/Button/Button";
import InputField from "../Common/Button/Input";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "../../core/auth/auth.api";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler";
import router from "../../routes";

const ForgotPassword = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailInput = useInputHandler({
    validators: [
      GV.required,
      GV.regexMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "ایمیل را وارد کنید.",
      [GeneralErrors.RegexMatch]: "ایمیل معتبر نیست.",
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
  const passwordInput = useInputHandler({
    validators: [GV.required, GV.minLength(8)],
    errorMessages: {
      [GeneralErrors.Required]: "رمز جدید را وارد کنید.",
      [GeneralErrors.MinimumLength]: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
    },
  });
  const repeatInput = useInputHandler({
    validators: [
      GV.required,
      (value) => value === passwordInput.rawValue ? undefined : "NOT-SAME",
    ],
    errorMessages: {
      [GeneralErrors.Required]: "تکرار رمز را وارد کنید.",
      "NOT-SAME": "تکرار رمز با رمز جدید یکسان نیست.",
    },
  });

  const requestCode = async () => {
    if (!emailInput.validate()) return;
    setLoading(true);
    try {
      const { data } = await requestPasswordReset({ email: emailInput.rawValue });
      setCodeSent(true);
      toast.success(data.detail);
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      toast.error(detail || "ارسال کد ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!codeInput.validate() || !passwordInput.validate() || !repeatInput.validate()) return;
    setLoading(true);
    try {
      const { data } = await confirmPasswordReset({
        email: emailInput.rawValue,
        code: codeInput.rawValue,
        new_password: passwordInput.rawValue,
      });
      toast.success(data.detail);
      await router.navigate("/login");
    } catch (error: unknown) {
      const payload = (error as AxiosError<{
        detail?: string;
        new_password?: string[];
      }>).response?.data;
      toast.error(payload?.detail || payload?.new_password?.[0] || "تغییر رمز ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-pattern flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg rounded-4xl bg-[#101010ee] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">بازیابی رمز عبور</h1>
        <p className="mt-3 mb-8 text-gray-300">
          کد بازیابی به ایمیل حساب شما فرستاده می‌شود.
        </p>
        <div className="flex flex-col gap-5">
          <InputField
            type="email"
            placeholder="example@linux-fest.ir"
            label="ایمیل"
            autocomplete="email"
            {...emailInput}
          />
          {codeSent && (
            <>
              <InputField
                type="text"
                placeholder="۱۲۳۴۵۶"
                label="کد بازیابی"
                autocomplete="one-time-code"
                {...codeInput}
              />
              <InputField
                type="password"
                placeholder="رمز جدید"
                label="رمز عبور جدید"
                autocomplete="new-password"
                {...passwordInput}
              />
              <InputField
                type="password"
                placeholder="تکرار رمز جدید"
                label="تکرار رمز عبور"
                autocomplete="new-password"
                {...repeatInput}
              />
            </>
          )}
          <Button
            loading={loading}
            onClick={codeSent ? resetPassword : requestCode}
            className="w-full"
          >
            {codeSent ? "تغییر رمز عبور" : "ارسال کد بازیابی"}
          </Button>
          {codeSent && (
            <button
              type="button"
              disabled={loading}
              onClick={requestCode}
              className="text-indigo disabled:text-gray-500 cursor-pointer"
            >
              ارسال دوباره کد
            </button>
          )}
          <Link to="/login" className="text-center text-gray-300">
            بازگشت به ورود
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
