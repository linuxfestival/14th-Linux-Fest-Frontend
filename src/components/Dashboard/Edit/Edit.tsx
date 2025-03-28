import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button, { ButtonSizes } from "../../Common/Button/Button";
import InputField from "../../Common/Button/Input";
import AvatarInput from "./Components/AvatarInput";
import { RootState, useAppDispatch } from "../../../store.ts";
import {
  changePasswordThunk,
  updateUserThunk,
} from "../../../core/users/users.thunk.ts";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ChangePasswordResponse } from "../../../core/users/users.dto.ts";
import { displayCommonErrorToast } from "../../../utils/toastUtils.ts";
import { digitsToLatin } from "../../../utils/digitsToPersian.ts";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../../hooks/useInputHandler.tsx";
import Loading from "../../Common/icons/Loading.tsx";

const Edit: React.FC = () => {
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState("");
  const { changePasswordLoading, user, loading } = useSelector(
    (state: RootState) => state.users
  );
  const { userPhoneNumber } = useSelector((state: RootState) => state.auth);

  // Change Info Fields

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

  const { rawValue: email, valid: isEmailValid } = emailInput;
  const { rawValue: firstName, valid: isFirstNameValid } = firstNameInput;
  const { rawValue: lastName, valid: isLastNameValid } = lastNameInput;

  const isInfoFormValid = useMemo(() => {
    return (
      isEmailValid &&
      isFirstNameValid &&
      isLastNameValid &&
      (email !== user?.email ||
        firstName !== user?.first_name ||
        lastName !== user?.last_name)
    );
  }, [emailInput, firstNameInput, lastNameInput, user]);

  // Change Password Fields

  const oldPasswordInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const newPasswordInput = useInputHandler({
    validators: [
      GV.required,
      GV.minLength(8),
      GV.regexMatch(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
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
      (value: string) => (value !== newPassword ? "NOT-SAME" : undefined),
      GV.required,
    ],
    errorMessages: {
      ["NOT-SAME"]: "رمز عبور با تکرار آن همخوانی ندارد!",
      [GeneralErrors.Required]: "لطفا این فیلد را پر کنید!",
    },
  });

  const { rawValue: oldPassword, valid: isOldPasswordValid } = oldPasswordInput;
  const { rawValue: newPassword, valid: isNewPasswordValid } = newPasswordInput;
  const { valid: isRepeatPassValid } = repeatPasswordInput;

  const isChangePasswordFormValid = useMemo(() => {
    return (
      isOldPasswordValid &&
      isNewPasswordValid &&
      isRepeatPassValid &&
      newPassword !== ""
    );
  }, [isOldPasswordValid, isNewPasswordValid, isRepeatPassValid, newPassword]);

  // Form Logic

  const changePasswordOnClick = useCallback(async () => {
    if (!isChangePasswordFormValid) {
      return;
    }

    const result = await dispatch(
      changePasswordThunk({
        new_password: newPassword,
        old_password: oldPassword,
      })
    );

    if (changePasswordThunk.fulfilled.match(result)) {
      toast.success("پسورد با موفقیت تغییر یافت.");
    } else {
      const payload = result.payload as ChangePasswordResponse;
      if (payload.detail) toast.error(payload.detail);
      else {
        const errorKey = Object.keys(payload)[0];
        const errorMessages = (payload[errorKey]?.slice(0, 1) as string[]).join(
          " "
        );
        toast.error(errorMessages || "An unexpected error occurred.");
      }
    }
  }, [dispatch, newPassword, oldPassword]);

  const editProfileOnClick = useCallback(() => {
    if (!userPhoneNumber) return;

    dispatch(
      updateUserThunk({
        phone_number: userPhoneNumber,
        avatar: avatar ? avatar : undefined,
        email,
        first_name: firstName,
        last_name: lastName,
      })
    ).then((result) => {
      if (updateUserThunk.fulfilled.match(result)) {
        toast.success("اطلاعات با موفقیت آپدیت شد!");
      } else {
        displayCommonErrorToast(result);
      }
    });
  }, [avatar, dispatch, email, firstName, lastName, userPhoneNumber]);

  useEffect(() => {
    if (user) {
      emailInput.setValue(user.email);
      firstNameInput.setValue(user.first_name);
      lastNameInput.setValue(user.last_name);
      setAvatarUrl(user.avatar ?? "");
    }
  }, [user]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <AvatarInput
        url={avatarUrl}
        onChange={(file: File) => {
          setAvatar(file);
        }}
        className="mt-12 md:mt-24"
      />
      <h2 className="text-3xl gap-2 flex mt-6">
        <span>تغییر اطلاعات</span>
        <span>{digitsToLatin(userPhoneNumber + "")}</span>
      </h2>
      <div className="flex flex-col space-y-4 max-w-xl w-full mt-8">
        <div className="flex items-center space-x-4">
          <InputField
            type="text"
            label="نام"
            placeholder=""
            loading={loading}
            {...firstNameInput}
          />
          <InputField
            type="text"
            label="نام خانوادگی"
            placeholder=""
            loading={loading}
            {...lastNameInput}
          />
        </div>
        <div className="flex items-center space-x-4">
          <InputField
            type="email"
            label="ایمیل"
            placeholder=""
            textDirection="ltr"
            loading={loading}
            {...emailInput}
          />
        </div>
        <div className="mb-6">
          <Button
            onClick={editProfileOnClick}
            size={ButtonSizes.SMALL}
            disabled={!isInfoFormValid}
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
            label="پسورد قبلی"
            placeholder="WowSoSecret"
            {...oldPasswordInput}
          />
        </div>
        <div className="flex items-center space-x-4">
          <InputField
            type="text"
            label="پسورد جدید"
            placeholder="WowSoSuperSecret"
            {...newPasswordInput}
          />
          <InputField
            type="text"
            label="تکرار پسورد جدید"
            placeholder="WowSoSuperSecret"
            {...repeatPasswordInput}
          />
        </div>
        <div className="mb-6">
          <Button
            disabled={!isChangePasswordFormValid}
            loading={changePasswordLoading}
            onClick={changePasswordOnClick}
            size={ButtonSizes.SMALL}
          >
            تغییر رمز
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
