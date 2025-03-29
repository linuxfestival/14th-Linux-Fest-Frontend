import BadgeLinux from "../../assets/penwing.png";
import Button from "../../components/Common/Button/Button.tsx";
import InputField from "../Common/Button/Input.tsx";
import {useEffect, useMemo, useState} from "react";
import { useSelector } from "react-redux";
import { signupThunk } from "../../core/auth/auth.thunk.ts";
import { RootState, useAppDispatch } from "../../store.ts";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import router from "../../routes.tsx";
import { displayCommonErrorToast } from "../../utils/toastUtils.ts";
import { Link } from "react-router-dom";
import { initializeUser } from "../../core/auth/auth.slice.ts";
import { FaArrowRight } from "react-icons/fa";
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
    beforeBlur: (value: string) => {
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

  const { rawValue: email, valid: isEmailValid } = emailInput;
  const { rawValue: firstName, valid: isFirstNameValid } = firstNameInput;
  const { rawValue: lastName, valid: isLastNameValid } = lastNameInput;
  const { rawValue: phoneNumber, valid: isPhoneNumberValid } = phoneNumberInput;
  const { rawValue: password, valid: isPasswordValid } = passwordInput;
  const { valid: isRepeatPassValid } = repeatPasswordInput;

  const isFormValid = useMemo(() => {
    return (
      isEmailValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isPhoneNumberValid &&
      isPasswordValid &&
      isRepeatPassValid
    );
  }, [
    isEmailValid,
    isFirstNameValid,
    isLastNameValid,
    isPhoneNumberValid,
    isPasswordValid,
    isRepeatPassValid,
  ]);

  useEffect(() => {
    console.log(
        isEmailValid,
        isFirstNameValid,
        isLastNameValid,
        isPhoneNumberValid,
        isPasswordValid,
        isRepeatPassValid,
        isFormValid
    )
  }, [
    isEmailValid,
    isFirstNameValid,
    isLastNameValid,
    isPhoneNumberValid,
    isPasswordValid,
    isRepeatPassValid,
    isFormValid
  ])

  const signup = async () => {
    if (!isFormValid) {
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
      await router.navigate("/");
    } else {
      displayCommonErrorToast(result);
      console.error("Signup failed:", result.payload);
    }
  };

  return (
    <div className="relative h-[100dvh] overflow-auto w-full p-4 md:p-13 flex justify-center items-center bg-pattern">
      <div className="relative flex rounded-4xl p-4 w-full h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl xl:w-auto xl:aspect-4/3">
        <div className="relative hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
          <img className="h-full object-cover" src={BadgeLinux} />
          <Link to={"/"}>
            <div className="absolute top-2 left-2 w-max flex justify-center items-center gap-2 px-4 py-2 bg-white/30 rounded-full cursor-pointer">
              <FaArrowRight size={16} className="text-white" />
              <p className="text-white font-bold">بازگشت به خانه</p>
            </div>
          </Link>
        </div>
        <div className="flex w-full md:w-4/7 flex-col md:m-10">
          <h1 className="text-4xl font-bold text-white">ثبت نام</h1>
          <p className="text-lg text-gray-300 mb-9">
            حساب کاربری دارید؟ &nbsp;
            <a
              href="/login"
              className="text-[#ffdd03] no-underline hover:underline"
            >
              وارد
            </a>
            &nbsp; شوید
          </p>
          <div className="flex p-2 gap-4 flex-col w-full pb-7 mb-6" dir="rtl">
            <div className="flex gap-4 flex-col md:flex-row w-full right">
              <InputField
                type="text"
                placeholder="James"
                label="نام"
                {...firstNameInput}
                className="w-full md:w-1/2"
              />
              <InputField
                type="text"
                placeholder="Hetfield"
                label="نام خانوادگی"
                {...lastNameInput}
                className="w-full md:w-1/2"
              />
            </div>
            <InputField
              type="email"
              placeholder="example@linux-fest.ir"
              label="ایمیل"
              {...emailInput}
            />
            <InputField
              type="text"
              autocomplete="tel"
              label="موبایل"
              placeholder="09xxxxxxxxx"
              {...phoneNumberInput}
            />
            <InputField
              type="password"
              autocomplete="new-password"
              label="پسورد"
              placeholder="WowSoSecret"
              {...passwordInput}
            />
            <InputField
              type="password"
              autocomplete="new-password"
              label="تکرار پسورد"
              placeholder="WowSoSecret"
              {...repeatPasswordInput}
            />
          </div>
          <Button
            disabled={!isFormValid}
            loading={loading}
            onClick={signup}
            className="w-full"
          >
            ثبت نام
          </Button>
          <div className="md:hidden w-full flex justify-center items-center">
            <Link to={"/"} className="mt-5 text-indigo text-lg">
              <span>خانه</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
