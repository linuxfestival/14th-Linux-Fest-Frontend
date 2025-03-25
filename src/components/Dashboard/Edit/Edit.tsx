import React, {useCallback, useState} from "react";
import Button, {ButtonSizes} from "../../Common/Button/Button";
import InputField from "../../Common/Button/Input";
import AvatarInput from "./Components/AvatarInput";
import {useAppDispatch} from "../../../store.ts";
import {changePasswordThunk} from "../../../core/users/users.thunk.ts";

const Edit: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");

    const dispatch = useAppDispatch();

    const changePasswordOnClick = useCallback(() => {
        if (!oldPassword || !newPassword || !repeatNewPassword) {
            //TODO: Toast
            return;
        }

        if (newPassword !== repeatNewPassword) {
            // TODO: Toast
            return;
        }

        dispatch(changePasswordThunk({
            new_password: newPassword,
            old_password: oldPassword,
        }))
        // TODO: Handle loading and errors
        // TODO: Handle successful toast
    }, [dispatch, newPassword, oldPassword, repeatNewPassword])

    const editProfileOnClick = useCallback(() => {

    }, [])

    return (
        <>
            <AvatarInput/>
            <h2 className="text-3xl mt-6">تغییر اطلاعات</h2>
            <div className="flex flex-col space-y-4 max-w-xl w-full mt-8">
                <div className="flex items-center space-x-4">
                    <InputField
                        type="text"
                        value=""
                        label="نام"
                        inputChangeHandler={() => console.log("")}
                        placeholder="مارک"
                    />
                    <InputField
                        type="text"
                        value=""
                        label="نام خانوادگی"
                        inputChangeHandler={() => console.log("")}
                        placeholder="فیشباک"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <InputField
                        type="email"
                        value="ایمیل"
                        label="عنوان"
                        inputChangeHandler={() => console.log("")}
                        placeholder="email@example.com"
                        textDirection="ltr"
                    />
                </div>
                <div className="mb-6">
                    <Button size={ButtonSizes.SMALL}>ثبت</Button>
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
                    />
                </div>
                <div className="mb-6">
                    <Button onClick={changePasswordOnClick} size={ButtonSizes.SMALL}>تغییر رمز</Button>
                </div>
            </div>
        </>
    );
};

export default Edit;
