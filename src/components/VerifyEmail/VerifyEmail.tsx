import { useRef, useState } from "react";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";
import AuthSubmit from "../Auth/AuthSubmit";
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
  const formRef = useRef<HTMLFormElement>(null);
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
    if (loading) return;
    if (![emailInput.validate(), codeInput.validate()].every(Boolean)) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLInputElement>('input[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
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
      dispatch(
        initializeUser({
          ...data.tokens,
          phone_number: data.phone_number,
        }),
      );
      toast.success("ایمیل شما تأیید شد.");
      await router.navigate(data.is_first_login ? "/onboarding" : "/");
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data
        ?.detail;
      toast.error(detail || "تأیید ایمیل ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (loading) return;
    if (!emailInput.validate()) return;
    setLoading(true);
    try {
      const { data } = await resendActivation({ email: emailInput.rawValue });
      toast.success(data.detail);
    } catch (error: unknown) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data
        ?.detail;
      toast.error(detail || "ارسال دوباره کد ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="تأیید ایمیل"
      description="کد ۶ رقمی ارسال‌شده به ایمیل خود را وارد کنید."
    >
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <fieldset disabled={loading} className="space-y-5">
          <AuthField
            name="email"
            type="email"
            direction="ltr"
            placeholder="example@linux-fest.ir"
            label="ایمیل"
            autoComplete="email"
            {...emailInput}
          />
          <AuthField
            name="code"
            type="text"
            direction="ltr"
            inputMode="numeric"
            maxLength={6}
            placeholder="۱۲۳۴۵۶"
            label="کد تأیید"
            autoComplete="one-time-code"
            {...codeInput}
          />
        </fieldset>
        <div className="mt-6">
          <AuthSubmit loading={loading}>تأیید و ورود</AuthSubmit>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={resend}
            className="min-h-11 cursor-pointer rounded-lg px-2 text-sm font-bold text-orange-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            ارسال دوباره کد
          </button>
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-bold text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
          >
            بازگشت به ورود
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
