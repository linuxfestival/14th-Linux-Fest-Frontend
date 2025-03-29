import BadgeLinux from "../../assets/penwing.png";
import Button from "../../components/Common/Button/Button.tsx";
import InputField from "../Common/Button/Input.tsx";
import { RootState, useAppDispatch } from "../../store.ts";
import { loginThunk } from "../../core/auth/auth.thunk.ts";
import router from "../../routes.tsx";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { displayCommonErrorToast } from "../../utils/toastUtils.ts";
import { Link } from "react-router-dom";
import { initializeUser } from "../../core/auth/auth.slice.ts";
import { FaArrowRight } from "react-icons/fa";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../hooks/useInputHandler.tsx";

const phoneRegex = /^09[0-9]{9}$/;
const Login = () => {
  const phoneNumberInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
    numberOnly: true,
    persianDigits: true,
    maxLength: 11,
  });

  const passwordInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const { rawValue: phoneNumber, valid: isPhoneNumberValid } = phoneNumberInput;
  const { rawValue: password, valid: isPasswordValid } = passwordInput;

  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const login = async () => {
    if (!isPhoneNumberValid || !isPasswordValid) {
      return;
    }

    const result = await dispatch(
      loginThunk({ phone_number: phoneNumber, password })
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
      Cookies.set("phone_number", phoneNumber, {
        secure: true,
        sameSite: "Strict",
      });

      dispatch(
        initializeUser({
          phone_number: phoneNumber,
          refresh: userData.refresh,
          access: userData.access,
        })
      );

      await router.navigate("/");
    } else {
      console.log("!@! ", result.payload);
      const payload = result.payload as { [key: string]: any };
      if (
        payload.detail === "No active account found with the given credentials"
      ) {
        passwordInput.setErrorText("رمز عبور یا شماره تلفن اشتباه است");
        return;
      }
      displayCommonErrorToast(result);
    }
  };

  return (
    <div className="relative h-[100dvh] overflow-auto w-full p-4 lg:p-13 flex justify-center items-center bg-pattern">
      <div className="relative flex rounded-4xl p-4 w-full h-3/4 lg:h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl xl:w-auto xl:aspect-4/3">
        <div className="flex w-full md:w-4/7 flex-col md:m-10">
          <h1 className="text-4xl font-bold text-white">ورود</h1>
          <p className="text-lg text-gray-300 mb-9 mt-2">
            حساب کاربری ندارید؟ &nbsp;
            <a
              href="/signup"
              className="text-[#ffdd03] no-underline hover:underline"
            >
              ثبت نام
            </a>
            &nbsp; کنید
          </p>
          <div className="flex p-2 gap-4 flex-col w-full pb-7 mb-6">
            <InputField
              type="text"
              placeholder="09xxxxxxxxx"
              autocomplete="tel"
              label="شماره تلفن"
              name="phone_number"
              {...phoneNumberInput}
            />
            <InputField
              type="password"
              placeholder="WowSoSecret"
              autocomplete="current-password"
              label="پسورد"
              name="password"
              {...passwordInput}
            />
          </div>
          <Button
            disabled={!isPhoneNumberValid || !isPasswordValid}
            loading={loading}
            onClick={login}
            className="w-full"
          >
            ورود
          </Button>
          <div className="md:hidden w-full flex justify-center items-center">
            <Link to={"/"} className="mt-5 text-indigo text-lg">
              <span>خانه</span>
            </Link>
          </div>
        </div>
        <div className="relative hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
          <img className="h-full object-cover" src={BadgeLinux} />
          <Link to={"/"}>
            <div className="absolute top-2 left-2 w-max flex justify-center items-center gap-2 px-4 py-2 bg-white/30 rounded-full cursor-pointer">
              <FaArrowRight size={16} className="text-white" />
              <p className="text-white font-bold">بازگشت به خانه</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
