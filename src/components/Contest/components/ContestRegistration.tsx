import React from "react";
import { Form } from "react-router-dom";
import InputField from "../../Common/Button/Input";
import Button from "../../Common/Button/Button";
import useInputHandler, {
  GeneralErrors,
  GeneralValidators as GV,
} from "../../../hooks/useInputHandler";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../../store";
import { displayCommonErrorToast } from "../../../utils/toastUtils";

const phoneRegex = /^09[0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ContestRegistration = () => {
  const fullNameInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا نام کامل خود را وارد کنید!",
    },
  });

  const phoneNumberInput = useInputHandler({
    validators: [GV.required, GV.regexMatch(phoneRegex)],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا شماره تلفن خود را وارد کنید!",
      [GeneralErrors.RegexMatch]: "لطفا یک شماره تلفن معتبر وارد کنید!",
    },
    numberOnly: true,
    persianDigits: true,
    maxLength: 11,
  });

  const emailInput = useInputHandler({
    validators: [GV.required, GV.regexMatch(emailRegex)],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا ایمیل خود را وارد کنید!",
      [GeneralErrors.RegexMatch]: "لطفا یک ایمیل معتبر وارد کنید!",
    },
  });

  const universityInput = useInputHandler({
    validators: [GV.required],
    errorMessages: {
      [GeneralErrors.Required]: "لطفا نام دانشگاه خود را وارد کنید!",
    },
  });

  const { rawValue: fullName, valid: isFullNameValid } = fullNameInput;
  const { rawValue: phoneNumber, valid: isPhoneNumberValid } = phoneNumberInput;
  const { rawValue: email, valid: isEmailValid } = emailInput;
  const { rawValue: university, valid: isUniversityValid } = universityInput;

  const dispatch = useAppDispatch();
  const loading = false;

  const registerForContest = async () => {
    if (
      !isFullNameValid ||
      !isPhoneNumberValid ||
      !isEmailValid ||
      !isUniversityValid
    ) {
      return;
    }

    // const result = await dispatch(
    //   registerContestThunk({
    //     full_name: fullName,
    //     phone_number: phoneNumber,
    //     email,
    //     university
    //   })
    // );

    // if (registerContestThunk.fulfilled.match(result)) {
    // } else {
    //   displayCommonErrorToast(result);
    // }

    console.log("Registration submitted:", {
      fullName,
      phoneNumber,
      email,
      university,
    });
  };

  return (
    <div className="relative h-full w-full p-4 flex justify-center items-center px-20">
      <div className="relative flex rounded-4xl p-4 w-full gap-2 justify-between items-center ">
        <div className="flex w-full flex-col items-center md:m-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            ثبت نام در مسابقه
          </h1>
          <div className="flex p-2 gap-4 flex-col w-full pb-7 mb-6">
            <InputField
              type="text"
              placeholder="نام و نام خانوادگی"
              autocomplete="name"
              label="نام کامل"
              name="fullname"
              {...fullNameInput}
            />
            <InputField
              type="text"
              placeholder="09xxxxxxxxx"
              autocomplete="tel"
              label="شماره تلفن"
              name="phone_number"
              {...phoneNumberInput}
            />
            <InputField
              type="email"
              placeholder="example@example.com"
              autocomplete="email"
              label="ایمیل"
              name="email"
              {...emailInput}
            />
            <InputField
              type="text"
              placeholder="نام دانشگاه"
              label="دانشگاه"
              name="university"
              {...universityInput}
            />
          </div>
          <Button
            disabled={
              !isFullNameValid ||
              !isPhoneNumberValid ||
              !isEmailValid ||
              !isUniversityValid
            }
            loading={loading}
            onClick={registerForContest}
            className="w-full"
          >
            ثبت نام در مسابقه
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestRegistration;
