import React, { useState } from "react";
import Sidebar from "../../sidebar/Sidebar";
import Button, { ButtonSizes } from "../../Common/Button/Button";
import InputField from "../../Common/Button/Input";
import AvatarInput from "./Components/AvatarInput";

const Edit: React.FC = () => {
  return (
    <>
      <AvatarInput />
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
    </>
  );
};

export default Edit;
