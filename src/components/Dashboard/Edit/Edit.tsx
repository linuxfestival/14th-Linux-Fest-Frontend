import React, {useCallback, useEffect, useState} from "react";
import Button, {ButtonSizes} from "../../Common/Button/Button";
import InputField from "../../Common/Button/Input";
import AvatarInput from "./Components/AvatarInput";
import {RootState, useAppDispatch} from "../../../store.ts";
import {changePasswordThunk, updateUserThunk} from "../../../core/users/users.thunk.ts";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {ChangePasswordResponse} from "../../../core/users/users.dto.ts";
import {displayCommonErrorToast} from "../../../utils/toastUtils.ts";
import {digitsToPersian} from "../../../utils/digitsToPersian.ts";

const Edit: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [avatar, setAvatar] = useState<File>();
    const [avatarUrl, setAvatarUrl] = useState("");

    const dispatch = useAppDispatch();
    const {changePasswordLoading, user} = useSelector((state: RootState) => state.users)
    const {userPhoneNumber} = useSelector((state: RootState) => state.auth)

    const changePasswordOnClick = useCallback(async () => {
        if (!oldPassword || !newPassword || !repeatNewPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (newPassword !== repeatNewPassword) {
            return;
        }


        const result = await dispatch(changePasswordThunk({
            new_password: newPassword,
            old_password: oldPassword,
        }))

        if (changePasswordThunk.fulfilled.match(result)) {
            toast.success("پسورد با موفقیت تغییر یافت.");
        } else {
            const payload = result.payload as ChangePasswordResponse;
            if (payload.detail)
                toast.error(payload.detail);
            else {
                const errorKey = Object.keys(payload)[0];
                const errorMessages = (payload[errorKey]?.slice(0, 1) as string[]).join(" ");
                toast.error(errorMessages || "An unexpected error occurred.");
            }
        }

    }, [dispatch, newPassword, oldPassword, repeatNewPassword])

    const editProfileOnClick = useCallback(() => {
        if (!userPhoneNumber)
            return;

        dispatch(updateUserThunk({
            phone_number: userPhoneNumber,
            avatar: avatar ? avatar : undefined,
            email,
            first_name: firstName,
            last_name: lastName,
        }))
            .then(result => {
                if (updateUserThunk.fulfilled.match(result)) {
                    toast.success("اطلاعات با موفقیت آپدیت شد!")
                } else {
                    displayCommonErrorToast(result);
                }
            })
    }, [avatar, dispatch, email, firstName, lastName, userPhoneNumber])


    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setAvatarUrl(user.avatar ?? "");
        }
    }, [user]);

    return (
        <>
            <AvatarInput url={avatarUrl} onChange={(file: File) => {
                setAvatar(file)
            }}/>
            <h2 className="text-3xl gap-2 flex mt-6">
                <span>
                    تغییر اطلاعات
                </span>
                <span>{digitsToPersian(userPhoneNumber + "")}</span>
            </h2>
            <div className="flex flex-col space-y-4 max-w-xl w-full mt-8">
                <div className="flex items-center space-x-4">
                    <InputField
                        type="text"
                        value={firstName}
                        label="نام"
                        inputChangeHandler={(e) => setFirstName(e.target.value)}
                        placeholder="مارک"
                    />
                    <InputField
                        type="text"
                        value={lastName}
                        label="نام خانوادگی"
                        inputChangeHandler={(e) => setLastName(e.target.value)}
                        placeholder="فیشباک"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <InputField
                        type="email"
                        value={email}
                        label="ایمیل"
                        inputChangeHandler={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        textDirection="ltr"
                    />
                </div>
                <div className="mb-6">
                    <Button
                        onClick={editProfileOnClick}
                        size={ButtonSizes.SMALL}
                        disabled={!firstName || !lastName || !email}
                    >
                        ثبت
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4 max-w-xl w-full mt-8">
                <h2 className="text-3xl">تغییر پسورد</h2>
                <div className="flex items-center space-x-4">
                    <InputField
                        type="text"
                        value={oldPassword}
                        label="پسورد قبلی"
                        inputChangeHandler={(e) => setOldPassword(e.target.value)}
                        placeholder="WowSoSecret"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <InputField
                        type="text"
                        value={newPassword}
                        label="پسورد جدید"
                        inputChangeHandler={(e) => setNewPassword(e.target.value)}
                        placeholder="WowSoSuperSecret"
                    />
                    <InputField
                        type="text"
                        value={repeatNewPassword}
                        label="تکرار پسورد جدید"
                        inputChangeHandler={(e) => setRepeatNewPassword(e.target.value)}
                        placeholder="WowSoSuperSecret"
                        regexValid={newPassword ? newPassword === repeatNewPassword : null}
                        errorText={"پسورد سازگار نیست!"}
                    />
                </div>
                <div className="mb-6">
                    <Button disabled={changePasswordLoading || !newPassword || !oldPassword || !repeatNewPassword}
                            onClick={changePasswordOnClick} size={ButtonSizes.SMALL}>
                        تغییر رمز
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Edit;
