import BadgeLinux from "../../assets/saygex.png";
import Button from "../../components/Common/Button/Button.tsx";
import InputField from "../Common/Button/Input.tsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../../core/auth/auth.thunk.ts";
import { RootState, useAppDispatch } from "../../store.ts";
import { toast } from "react-toastify";

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const { loading } = useSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();

  const phoneRegex = /^09[0-9]{9}$/;

  const signup = async () => {
    if (password !== repeatPassword) {
      // TODO: Display Error in repeat password field
      toast.error("رمز عبور و تکرار آن باید یکسان باشند!");
      return;
    }

    if (password.length < 8) {
      // TODO: Display Error in password field
      toast.error("رمز عبور باید حداقل ۸ کاراکتر باشد!");
      return;
    }

    if (!password || !phoneNumber || !email || !firstName || !lastName) {
      // TODO: Display error on every field
      toast.error("لطفا تمامی فیلد ها را پر کنید!");
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
      // TODO: Log user in
      console.log("Signup successful:", result.payload);
    } else {
      // TODO: Display toast🍞
      console.error("Signup failed:", result.payload);
    }
  };

  return (
    <div className="relative h-[100dvh] overflow-auto w-full p-4 md:p-13 flex justify-center items-center bg-pattern">
      <div className="relative flex rounded-4xl p-4 w-full md:h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl md:w-auto md:aspect-4/3">
        <div className="hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
          <img className="h-full object-cover" src={BadgeLinux} />
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
                required
                label="نام"
                value={firstName}
                inputChangeHandler={(e) => setFirstName(e.target.value)}
                className="w-full md:w-1/2"
              />
              <InputField
                type="text"
                placeholder="Hetfield"
                label="نام خانوادگی"
                value={lastName}
                inputChangeHandler={(e) => setLastName(e.target.value)}
                required
                className="w-full md:w-1/2"
              />
            </div>
            <InputField
              type="email"
              placeholder="example@linux-fest.ir"
              label="ایمیل"
              value={email}
              required
              inputChangeHandler={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="text"
              autocomplete="tel"
              label="موبایل"
              placeholder="09xxxxxxxxx"
              regexValid={phoneRegex.test(phoneNumber)}
              errorText="فرمت تلفن همراه اشتباه است!"
              required
              value={phoneNumber}
              inputChangeHandler={(e) => setPhoneNumber(e.target.value)}
            />
            <InputField
              type="text"
              autocomplete="new-password"
              label="پسورد"
              placeholder="WowSoSecret"
              value={password}
              required
              inputChangeHandler={(e) => setPassword(e.target.value)}
            />
            <InputField
              type="text"
              autocomplete="new-password"
              label="تکرار پسورد"
              placeholder="WowSoSecret"
              value={repeatPassword}
              required
              inputChangeHandler={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
          <Button disabled={loading} onClick={signup} className="w-full">
            ثبت نام
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
