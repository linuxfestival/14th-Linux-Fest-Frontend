import BadgeLinux from "../../assets/saygex.png";
import Button from "../../components/Common/Button/Button.tsx";
import {useState} from "react";
import InputField from "../Common/Button/Input.tsx";
import {RootState, useAppDispatch} from "../../store.ts";
import {loginThunk, signupThunk} from "../../core/auth/auth.thunk.ts";
import router from "../../routes.tsx";
import {useSelector} from "react-redux";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import Cookies from "js-cookie";

const Login = () => {
  const phoneRegex = /^09[0-9]{9}$/;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  const login = async () => {
    if (!phoneNumber || !password) {
      // TODO: Show a toast message for empty fields
      return;
    }

    const result = await dispatch(loginThunk({ phone_number: phoneNumber, password }));

    if (loginThunk.fulfilled.match(result)) {
      const userData = result.payload; // This contains access and refresh tokens

      Cookies.set("access_token", userData.access, { secure: true, sameSite: "Strict" });
      Cookies.set("refresh_token", userData.refresh, { secure: true, sameSite: "Strict" });
      Cookies.set("phone_number", phoneNumber, { secure: true, sameSite: "Strict" });

      await router.navigate("/profile/edit");
    } else {
      // ❌ Show error toast
      console.error("Login failed:", result.payload);
    }
  };

  return (
    <div className="relative h-[100dvh] overflow-auto w-full p-4 lg:p-13 flex justify-center items-center bg-pattern">
      <div className="relative flex rounded-4xl p-4 w-full lg:h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl lg:w-auto lg:aspect-4/3">
        <div className="flex w-full md:w-4/7 flex-col md:m-10">
          <h1 className="text-4xl font-bold text-white">ورود</h1>
          <p className="text-lg text-gray-300 mb-9">حساب کاربری ندارید؟
            &nbsp;<a href="/signup" className="text-[#ffdd03] no-underline hover:underline">ثبت نام</a>&nbsp;
            کنید</p>
          <div className="flex p-2 gap-4 flex-col w-full pb-7 mb-6">
            <InputField
              type="text"
              placeholder="09xxxxxxxxx"
              autocomplete="tel"
              label="شماره تلفن"
              errorText="فرمت تلفن همراه اشتباه است!"
              regexValid={phoneRegex.test(phoneNumber)}
              value={phoneNumber}
              inputChangeHandler={(e) => setPhoneNumber(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="WowSoSecret"
              autocomplete="new-password"
              label="پسورد"
              value={password}
              inputChangeHandler={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={loading} onClick={login} className="w-full">
            ورود
          </Button>
        </div>
        <div className="hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
          <img className="h-full object-cover" src={BadgeLinux} />
        </div>
      </div>
    </div>
  );
};

export default Login;