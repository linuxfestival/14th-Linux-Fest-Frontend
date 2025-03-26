import BadgeLinux from "../../assets/penwing.png";
import Button from "../../components/Common/Button/Button.tsx";
import {useState} from "react";
import InputField from "../Common/Button/Input.tsx";
import {RootState, useAppDispatch} from "../../store.ts";
import {loginThunk} from "../../core/auth/auth.thunk.ts";
import router from "../../routes.tsx";
import {useSelector} from "react-redux";
import Cookies from "js-cookie";
import {displayCommonErrorToast} from "../../utils/toastUtils.ts";
import {Link} from "react-router-dom";
import {initializeUser} from "../../core/auth/auth.slice.ts";


const Login = () => {
    const phoneRegex = /^09[0-9]{9}$/;
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();
    const {loading} = useSelector((state: RootState) => state.auth);

    const login = async () => {
        if (!phoneNumber || !password) {
            // TODO: Show a toast message for empty fields
            return;
        }

        const result = await dispatch(
            loginThunk({phone_number: phoneNumber, password})
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

            dispatch(initializeUser({
                phone_number: phoneNumber,
                refresh: userData.refresh,
                access: userData.access
            }))

            await router.navigate("/");
        } else {
            displayCommonErrorToast(result)
        }
    };

    return (
        <div
            className="relative h-[100dvh] overflow-auto w-full p-4 lg:p-13 flex justify-center items-center bg-pattern">
            <div
                className="relative flex rounded-4xl p-4 w-full lg:h-full gap-2 justify-between items-center bg-[#101010cc] shadow-2xl lg:w-auto lg:aspect-4/3">
                <div className="flex w-full md:w-4/7 flex-col md:m-10">
                    <h1 className="text-4xl font-bold text-white">ورود</h1>
                    <p className="text-lg text-gray-300 mb-9">
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
                            errorText="فرمت تلفن همراه اشتباه است!"
                            regexValid={
                                phoneNumber.length > 0 ? phoneRegex.test(phoneNumber) : undefined
                            }
                            value={phoneNumber}
                            inputChangeHandler={(e) => setPhoneNumber(e.target.value)}
                            labelClassName="!bg-[#101010cc]"
                        />
                        <InputField
                            type="password"
                            placeholder="WowSoSecret"
                            autocomplete="current-password"
                            label="پسورد"
                            value={password}
                            inputChangeHandler={(e) => setPassword(e.target.value)}
                            labelClassName="!bg-[#101010cc]"
                        />
                    </div>
                    <Button disabled={loading} onClick={login} className="w-full">
                        ورود
                    </Button>
                    <div
                        className="w-full flex justify-center items-center"
                    >
                        <Link to={"/"} className="mt-5 text-indigo text-lg">
              <span>
                  خانه
              </span>
                        </Link>
                    </div>
                </div>
                <div
                    className="hidden md:flex w-3/7 h-full rounded-3xl overflow-hidden justify-center items-center shadow-lg">
                    <img className="h-full object-cover" src={BadgeLinux}/>
                </div>
            </div>
        </div>
    );
};

export default Login;
