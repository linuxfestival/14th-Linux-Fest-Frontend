import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";
import AuthSubmit from "../Auth/AuthSubmit";
import { useSelector } from "react-redux";
import { signupThunk } from "../../core/auth/auth.thunk.ts";
import { RootState, useAppDispatch } from "../../store.ts";
import Cookies from "js-cookie";
import router from "../../routes.tsx";
import { displayCommonErrorToast } from "../../utils/toastUtils.ts";
import { initializeUser } from "../../core/auth/auth.slice.ts";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler.tsx";

const phoneRegex = /^09[0-9]{9}$/;
const Signup = () => {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const emailInput = useInputHandler({
    validators: [
      GV.required,
      GV.regexMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
      [GeneralErrors.RegexMatch]: "ایمیل وارد شده معتبر نیست!",
    },
  });

  const firstNameInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const lastNameInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const phoneNumberInput = useInputHandler({
    validators: [GV.required, GV.regexMatch(phoneRegex)],
    errorMessages: {
      [GeneralErrors.RegexMatch]: "شماره تلفن وارد شده صحیح نیست!",
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
    numberOnly: true,
    persianDigits: true,
    maxLength: 11,
  });

  const passwordInput = useInputHandler({
    validators: [
      GV.required,
      GV.minLength(8),
      GV.regexMatch(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@+!#$%^&*]{8,}$/),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
      [GeneralErrors.MinimumLength]: "رمز عبور باید حداقل ۸ کاراکتر باشد!",
      [GeneralErrors.RegexMatch]:
        "رمز عبور باید شامل حروف انگلیسی و اعداد باشد!",
    },
    beforeBlur: () => {
      repeatPasswordInput.validate();
    },
  });

  const repeatPasswordInput = useInputHandler({
    validators: [
      (value: string) => (value !== password ? "NOT-SAME" : undefined),
      GV.required,
    ],
    errorMessages: {
      ["NOT-SAME"]: "رمز عبور با تکرار آن همخوانی ندارد!",
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const { rawValue: email } = emailInput;
  const { rawValue: firstName } = firstNameInput;
  const { rawValue: lastName } = lastNameInput;
  const { rawValue: phoneNumber } = phoneNumberInput;
  const { rawValue: password } = passwordInput;

  const signup = async () => {
    if (loading) return;
    const valid = [firstNameInput, lastNameInput, emailInput, phoneNumberInput, passwordInput, repeatPasswordInput].map(input => input.validate()).every(Boolean);
    if (!valid) {
      requestAnimationFrame(() => document.querySelector<HTMLInputElement>('input[aria-invalid="true"]')?.focus());
      return;
    }

    const result = await dispatch(
      signupThunk({
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        phone_number: phoneNumber,
      })
    );

    if (signupThunk.fulfilled.match(result)) {
      if (result.payload.verification_required) {
        await router.navigate(
          `/verify-email?email=${encodeURIComponent(result.payload.email)}`
        );
        return;
      }

      if (!result.payload.tokens) {
        displayCommonErrorToast({
          payload: { detail: "توکن ورود از سرور دریافت نشد." },
        });
        return;
      }

      Cookies.set("access_token", result.payload.tokens.access, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refresh_token", result.payload.tokens.refresh, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("phone_number", phoneNumber, {
        secure: true,
        sameSite: "Strict",
      });
      dispatch(
        initializeUser({
          phone_number: phoneNumber,
          refresh: result.payload.tokens.refresh,
          access: result.payload.tokens.access,
        })
      );
      await router.navigate(
        result.payload.is_first_login ? "/onboarding" : "/"
      );
    } else {
      displayCommonErrorToast(result);
    }
  };

  return (
    <AuthLayout title="ثبت‌نام" signup>
      <form noValidate onSubmit={event => { event.preventDefault(); void signup(); }}>
        <fieldset disabled={loading} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField name="first_name" label="نام" placeholder="نام" autoComplete="given-name" {...firstNameInput} />
            <AuthField name="last_name" label="نام خانوادگی" placeholder="نام خانوادگی" autoComplete="family-name" {...lastNameInput} />
          </div>
          <AuthField type="email" name="email" label="ایمیل" placeholder="you@example.com" autoComplete="email" direction="ltr" {...emailInput} />
          <AuthField type="tel" name="phone_number" label="شماره موبایل" placeholder="۰۹۱۲۳۴۵۶۷۸۹" autoComplete="tel" inputMode="tel" direction="ltr" maxLength={11} {...phoneNumberInput} />
          <AuthField type="password" name="password" label="رمز عبور" placeholder="رمز عبور جدید" autoComplete="new-password" direction="ltr" hint="حداقل ۸ کاراکتر؛ شامل حروف انگلیسی و عدد." {...passwordInput} />
          <AuthField type="password" name="password_repeat" label="تکرار رمز عبور" placeholder="رمز عبور را دوباره وارد کن" autoComplete="new-password" direction="ltr" {...repeatPasswordInput} />
        </fieldset>
        <div className="mt-7"><AuthSubmit loading={loading}>ساخت حساب کاربری</AuthSubmit></div>
      </form>
    </AuthLayout>
  );
};

export default Signup;
