import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";
import AuthSubmit from "../Auth/AuthSubmit";
import { HiArrowRight, HiCheck } from "react-icons/hi2";
import {
  confirmPasswordReset,
  requestPasswordReset,
} from "../../core/auth/auth.api";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler";
import router from "../../routes";
import { digitsToPersian } from "../../utils/digitsToPersian";

const RESEND_COOLDOWN_SECONDS = 90;

const ForgotPassword = () => {
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [errorText, setErrorText] = useState("");
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!resendAvailableAt) return;
    const updateCountdown = () => {
      const seconds = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
      setResendSeconds(seconds);
      if (seconds === 0) setResendAvailableAt(0);
    };
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    document.addEventListener("visibilitychange", updateCountdown);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateCountdown);
    };
  }, [resendAvailableAt]);
  const resendCountdown = digitsToPersian(
    `${Math.floor(resendSeconds / 60).toString().padStart(2, "0")}:${(resendSeconds % 60).toString().padStart(2, "0")}`
  );
  useEffect(() => {
    if (codeSent) formRef.current?.querySelector<HTMLInputElement>('input[name="code"]')?.focus();
  }, [codeSent]);
  const focusInvalidField = () => {
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[aria-invalid="true"]')?.focus());
  };
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
    if (loading || (codeSent && Date.now() < resendAvailableAt)) return;
    if (!emailInput.validate()) { focusInvalidField(); return; }
    setErrorText("");
    setLoading(true);
    try {
      const email = codeSent ? sentEmail : emailInput.rawValue;
      const { data } = await requestPasswordReset({ email });
      setSentEmail(email);
      setCodeSent(true);
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
      setResendAvailableAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      toast.success(data.detail);
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail;
      setErrorText(detail || "ارسال کد ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (loading) return;
    const valid = [codeInput.validate(), passwordInput.validate(), repeatInput.validate()].every(Boolean);
    if (!valid) { focusInvalidField(); return; }
    setErrorText("");
    setLoading(true);
    try {
      const { data } = await confirmPasswordReset({
        email: sentEmail,
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
      setErrorText(payload?.detail || payload?.new_password?.[0] || "تغییر رمز ناموفق بود. کد را بررسی کنید و دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = () => {
    setCodeSent(false);
    setSentEmail("");
    setErrorText("");
    setResendAvailableAt(0);
    setResendSeconds(0);
    for (const input of [codeInput, passwordInput, repeatInput]) {
      input.setValue("");
      input.setErrorText(undefined);
    }
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus());
  };

  return (
    <AuthLayout title="بازیابی رمز عبور" description={codeSent ? "کد دریافتی را وارد کنید و یک رمز عبور جدید بسازید." : "ایمیل حساب خود را وارد کنید تا کد بازیابی برایتان ارسال شود."}>
      <ol aria-label="مراحل بازیابی رمز عبور" className="mb-6 grid grid-cols-2 gap-4 text-xs font-bold sm:text-sm">
        {["ایمیل حساب", "رمز عبور جدید"].map((step, index) => (
          <li key={step} aria-current={index === (codeSent ? 1 : 0) ? "step" : undefined} className={`flex items-center gap-2 border-b-2 pb-3 ${index <= (codeSent ? 1 : 0) ? "border-secondary text-primary" : "border-primary/15 text-dark-gray"}`}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo/25 text-xs">{codeSent && index === 0 ? <HiCheck aria-hidden="true" className="size-4" /> : index === 0 ? "۱" : "۲"}</span>
            {step}
          </li>
        ))}
      </ol>
      <form ref={formRef} noValidate onSubmit={event => { event.preventDefault(); void (codeSent ? resetPassword() : requestCode()); }}>
        <fieldset disabled={loading} className="space-y-5">
          {codeSent ? (
            <>
              <div className="border-b border-primary/15 pb-4">
                <p role="status" className="text-xs leading-6 text-dark-gray">کد بازیابی به این ایمیل ارسال شد:</p>
                <div className="flex flex-wrap items-center justify-between gap-x-3">
                  <bdi dir="ltr" className="min-w-0 break-all text-sm font-bold">{sentEmail}</bdi>
                  <button type="button" onClick={changeEmail} className="min-h-11 cursor-pointer rounded-sm text-xs font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">تغییر ایمیل</button>
                </div>
              </div>
              <AuthField type="text" name="code" label="کد بازیابی" placeholder="۱۲۳۴۵۶" autoComplete="one-time-code" inputMode="numeric" direction="ltr" maxLength={6} hint="کد ۶ رقمی ایمیل را وارد کنید؛ پوشه اسپم را هم بررسی کنید." {...codeInput} />
              <AuthField type="password" name="new-password" label="رمز عبور جدید" placeholder="رمز جدید را وارد کنید" autoComplete="new-password" direction="ltr" hint="حداقل ۸ کاراکتر" {...passwordInput} />
              <AuthField type="password" name="repeat-password" label="تکرار رمز عبور" placeholder="رمز جدید را دوباره وارد کنید" autoComplete="new-password" direction="ltr" {...repeatInput} />
            </>
          ) : <AuthField type="email" name="email" label="ایمیل" placeholder="you@example.com" autoComplete="email" direction="ltr" {...emailInput} />}
        </fieldset>
        {errorText && <p role="alert" className="mt-4 text-sm leading-7 text-ubuntu-red">{errorText}</p>}
        <div className="mt-6"><AuthSubmit loading={loading}>{codeSent ? "تغییر رمز عبور" : "ارسال کد بازیابی"}</AuthSubmit></div>
        {codeSent && <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-xs text-dark-gray"><span>کد را دریافت نکردید؟</span><button type="button" disabled={loading || resendSeconds > 0} onClick={() => void requestCode()} className="min-h-11 cursor-pointer rounded-sm font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-dark-gray disabled:no-underline">ارسال دوباره کد{resendSeconds > 0 && <> (<bdi dir="ltr" className="tabular-nums">{resendCountdown}</bdi>)</>}</button></div>}
      </form>
      <Link to="/login" className="mt-5 flex min-h-11 w-fit items-center gap-2 rounded-sm text-xs font-bold text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><HiArrowRight aria-hidden="true" className="size-4" />بازگشت به ورود</Link>
    </AuthLayout>
  );
};

export default ForgotPassword;
