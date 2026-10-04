import AuthLayout from "../Auth/AuthLayout";
import AuthField from "../Auth/AuthField";
import AuthSubmit from "../Auth/AuthSubmit";
import { RootState, useAppDispatch } from "../../store.ts";
import { loginThunk } from "../../core/auth/auth.thunk.ts";
import router from "../../routes.tsx";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { displayCommonErrorToast } from "../../utils/toastUtils.ts";
import { Link } from "react-router-dom";
import { initializeUser } from "../../core/auth/auth.slice.ts";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler.tsx";

const Login = () => {
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

  const passwordInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const { rawValue: email } = emailInput;
  const { rawValue: password } = passwordInput;

  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const login = async () => {
    if (loading) return;
    const valid = [emailInput.validate(), passwordInput.validate()].every(Boolean);
    if (!valid) {
      requestAnimationFrame(() => document.querySelector<HTMLInputElement>('input[aria-invalid="true"]')?.focus());
      return;
    }

    const result = await dispatch(
      loginThunk({ email, password })
    );

    if (loginThunk.fulfilled.match(result)) {
      const userData = result.payload; // This contains access and refresh tokens

      Cookies.set("access_token", userData.access, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refresh_token", userData.refresh, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("phone_number", userData.phone_number, {
        secure: true,
        sameSite: "Strict",
      });

      dispatch(
        initializeUser({
          phone_number: userData.phone_number,
          refresh: userData.refresh,
          access: userData.access,
        })
      );

      await router.navigate(userData.is_first_login ? "/onboarding" : "/");
    } else {
      const payload = (result.payload || {}) as {
        detail?: string;
        verification_required?: boolean;
        email?: string;
      };
      if (payload.verification_required) {
        await router.navigate(
          `/verify-email?email=${encodeURIComponent(payload.email || email)}`
        );
        return;
      }
      if (
        payload.detail === "No active account found with the given credentials."
      ) {
        passwordInput.setErrorText("رمز عبور یا ایمیل اشتباه است");
        return;
      }
      displayCommonErrorToast(result);
    }
  };

  return (
    <AuthLayout title="ورود">
      <form noValidate onSubmit={event => { event.preventDefault(); void login(); }}>
        <fieldset disabled={loading} className="space-y-5">
          <AuthField type="email" name="email" label="ایمیل" placeholder="you@example.com" autoComplete="email" direction="ltr" {...emailInput} />
          <AuthField type="password" name="password" label="رمز عبور" placeholder="رمز عبورت را وارد کن" autoComplete="current-password" direction="ltr" {...passwordInput} />
        </fieldset>
        <div className="mb-6 mt-3 flex justify-end">
          <Link to="/forgot-password" className="inline-flex min-h-11 items-center rounded-sm text-xs font-bold text-dark-gray underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">رمز عبورت را فراموش کرده‌ای؟</Link>
        </div>
        <AuthSubmit loading={loading}>ورود به حساب کاربری</AuthSubmit>
      </form>
    </AuthLayout>
  );
};

export default Login;
