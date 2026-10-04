import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { type RootState, useAppDispatch } from "../../../store";
import {
  changePasswordThunk,
  getUserByPhoneThunk,
  updateUserThunk,
} from "../../../core/users/users.thunk";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../../hooks/useInputHandler";
import AuthField from "../../Auth/AuthField";
import AvatarInput from "./Components/AvatarInput";
import {
  DashboardButton,
  DashboardLoading,
  DashboardPage,
  DashboardPanel,
} from "../DashboardUI";
import { secondaryActionClass } from "../dashboard.styles";

const errorMessage = (payload: unknown) => {
  if (typeof payload === "string") return payload;
  if (payload && typeof payload === "object")
    return (
      Object.values(payload)
        .flat()
        .find((value) => typeof value === "string") ||
      "درخواست ناموفق بود. دوباره تلاش کنید."
    );
  return "درخواست ناموفق بود. دوباره تلاش کنید.";
};
const Edit = () => {
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<File>();
  const [infoError, setInfoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const infoForm = useRef<HTMLFormElement>(null);
  const passwordForm = useRef<HTMLFormElement>(null);
  const { user, loading, updateUserLoading, changePasswordLoading } =
    useSelector((state: RootState) => state.users);
  const { userPhoneNumber } = useSelector((state: RootState) => state.auth);
  const firstName = useInputHandler({
    validators: [GV.required],
    errorMessages: { [GeneralErrors.Required]: "نام را وارد کنید." },
  });
  const lastName = useInputHandler({
    validators: [GV.required],
    errorMessages: { [GeneralErrors.Required]: "نام خانوادگی را وارد کنید." },
  });
  const email = useInputHandler({
    validators: [
      GV.required,
      GV.regexMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "ایمیل را وارد کنید.",
      [GeneralErrors.RegexMatch]: "ایمیل معتبر نیست.",
    },
  });
  const oldPassword = useInputHandler({
    validators: [GV.required],
    errorMessages: { [GeneralErrors.Required]: "رمز عبور فعلی را وارد کنید." },
  });
  const newPassword = useInputHandler({
    validators: [
      GV.required,
      GV.minLength(8),
      GV.regexMatch(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "رمز عبور جدید را وارد کنید.",
      [GeneralErrors.MinimumLength]: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
      [GeneralErrors.RegexMatch]:
        "رمز عبور باید شامل حروف انگلیسی و اعداد باشد.",
    },
  });
  const repeatPassword = useInputHandler({
    validators: [
      GV.required,
      (value) => (value === newPassword.rawValue ? undefined : "NOT-SAME"),
    ],
    errorMessages: {
      [GeneralErrors.Required]: "رمز جدید را دوباره وارد کنید.",
      "NOT-SAME": "تکرار رمز با رمز جدید یکسان نیست.",
    },
  });
  const { setValue: setEmail } = email;
  const { setValue: setFirstName } = firstName;
  const { setValue: setLastName } = lastName;
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setFirstName(user.first_name);
      setLastName(user.last_name);
    }
  }, [user, setEmail, setFirstName, setLastName]);
  const dirty =
    !!avatar ||
    email.rawValue !== user?.email ||
    firstName.rawValue !== user?.first_name ||
    lastName.rawValue !== user?.last_name;
  const focusError = (form: HTMLFormElement | null) =>
    requestAnimationFrame(() =>
      form
        ?.querySelector<HTMLInputElement>('input[aria-invalid="true"]')
        ?.focus(),
    );
  const saveProfile = async () => {
    if (updateUserLoading || !userPhoneNumber || !user) return;
    if (
      ![firstName.validate(), lastName.validate(), email.validate()].every(
        Boolean,
      )
    ) {
      focusError(infoForm.current);
      return;
    }
    setInfoError("");
    const result = await dispatch(
      updateUserThunk({
        phone_number: userPhoneNumber,
        avatar,
        email: email.rawValue,
        first_name: firstName.rawValue,
        last_name: lastName.rawValue,
      }),
    );
    if (updateUserThunk.fulfilled.match(result)) {
      setAvatar(undefined);
      toast.success("اطلاعات شما ذخیره شد.");
    } else setInfoError(errorMessage(result.payload));
  };
  const savePassword = async () => {
    if (changePasswordLoading) return;
    if (
      ![
        oldPassword.validate(),
        newPassword.validate(),
        repeatPassword.validate(),
      ].every(Boolean)
    ) {
      focusError(passwordForm.current);
      return;
    }
    setPasswordError("");
    const result = await dispatch(
      changePasswordThunk({
        old_password: oldPassword.rawValue,
        new_password: newPassword.rawValue,
      }),
    );
    if (changePasswordThunk.fulfilled.match(result)) {
      for (const input of [oldPassword, newPassword, repeatPassword]) {
        input.setValue("");
        input.setErrorText(undefined);
      }
      toast.success("رمز عبور با موفقیت تغییر کرد.");
    } else setPasswordError(errorMessage(result.payload));
  };
  return (
    <DashboardPage
      title="اطلاعات شخصی"
      description="اطلاعات حساب و رمز عبورتان را از اینجا مدیریت کنید."
    >
      {!user ? (
        <DashboardPanel>
          {loading ? (
            <DashboardLoading />
          ) : (
            <div role="alert">
              <p className="text-sm leading-7 text-ubuntu-red">
                اطلاعات حساب دریافت نشد. دوباره تلاش کنید.
              </p>
              <button
                type="button"
                className={`${secondaryActionClass} mt-4`}
                onClick={() => {
                  if (userPhoneNumber)
                    void dispatch(getUserByPhoneThunk(userPhoneNumber));
                }}
              >
                تلاش دوباره
              </button>
            </div>
          )}
        </DashboardPanel>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_1fr]">
          <DashboardPanel>
            <h2 className="mb-6 text-lg font-bold">پروفایل شما</h2>
            <form
              ref={infoForm}
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void saveProfile();
              }}
            >
              <fieldset
                disabled={updateUserLoading || loading}
                className="space-y-6"
              >
                <AvatarInput
                  key={user.avatar}
                  url={user.avatar || ""}
                  onChange={setAvatar}
                  disabled={updateUserLoading || loading}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <AuthField
                    label="نام"
                    name="first_name"
                    autoComplete="given-name"
                    {...firstName}
                  />
                  <AuthField
                    label="نام خانوادگی"
                    name="last_name"
                    autoComplete="family-name"
                    {...lastName}
                  />
                </div>
                <AuthField
                  label="ایمیل"
                  name="email"
                  type="email"
                  direction="ltr"
                  autoComplete="email"
                  {...email}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-4 text-sm">
                  <span className="text-dark-gray">شماره موبایل</span>
                  <bdi dir="ltr" className="font-bold">
                    {userPhoneNumber}
                  </bdi>
                </div>
              </fieldset>
              {infoError && (
                <p
                  role="alert"
                  className="mt-4 text-sm leading-7 text-ubuntu-red"
                >
                  {infoError}
                </p>
              )}
              <DashboardButton
                type="submit"
                loading={updateUserLoading}
                disabled={!dirty || loading}
                className="mt-6 w-full sm:w-auto"
              >
                ذخیره تغییرات
              </DashboardButton>
            </form>
          </DashboardPanel>
          <DashboardPanel>
            <h2 className="text-lg font-bold">امنیت حساب</h2>
            <p className="mt-2 text-sm leading-7 text-dark-gray">
              برای تغییر رمز، ابتدا رمز عبور فعلی را وارد کنید.
            </p>
            <form
              ref={passwordForm}
              noValidate
              className="mt-6"
              onSubmit={(event) => {
                event.preventDefault();
                void savePassword();
              }}
            >
              <fieldset disabled={changePasswordLoading} className="space-y-5">
                <AuthField
                  label="رمز عبور فعلی"
                  name="old_password"
                  type="password"
                  direction="ltr"
                  autoComplete="current-password"
                  {...oldPassword}
                />
                <AuthField
                  label="رمز عبور جدید"
                  name="new_password"
                  type="password"
                  direction="ltr"
                  autoComplete="new-password"
                  hint="حداقل ۸ کاراکتر، شامل حروف انگلیسی و اعداد"
                  {...newPassword}
                />
                <AuthField
                  label="تکرار رمز عبور جدید"
                  name="repeat_password"
                  type="password"
                  direction="ltr"
                  autoComplete="new-password"
                  {...repeatPassword}
                />
              </fieldset>
              {passwordError && (
                <p
                  role="alert"
                  className="mt-4 text-sm leading-7 text-ubuntu-red"
                >
                  {passwordError}
                </p>
              )}
              <DashboardButton
                type="submit"
                loading={changePasswordLoading}
                className="mt-6 w-full sm:w-auto"
              >
                تغییر رمز عبور
              </DashboardButton>
            </form>
          </DashboardPanel>
        </div>
      )}
    </DashboardPage>
  );
};
export default Edit;
