import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Button, { ButtonSizes } from "../Common/Button/Button";
import InputField from "../Common/Button/Input";
import defaultAvatar from "../../assets/images/pinguin.png";
import Camera from "../Common/icons/Camera";

const Settings: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(imageUrl);
    }
  };

  return (
      <div className="flex justify-center items-center w-full min-h-[100vh]">
        <div className="flex flex-col justify-center items-center bg-bg-secondary p-6 rounded-lg w-[80%] py-20 max-w-4xl">
          <div className="relative flex items-center justify-center mb-4 w-full max-w-xl">
            <img
              src={selectedImage || defaultAvatar}
              alt="User Avatar"
              className="size-32 rounded-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="avatarInput"
            />
            <label
              htmlFor="avatarInput"
              className="absolute flex justify-center items-center right-[calc(50%-64px)] bottom-0 size-10 rounded-full bg-gray-800 cursor-pointer"
            >
              <Camera />
            </label>
          </div>
          <div className="flex flex-col space-y-4 max-w-xl min-w-1/2">
            <div className="flex items-center space-x-4">
              <InputField
                type="text"
                value=""
                label="نام"
                inputChangeHandler={() => console.log("")}
                placeholder="مارک"
              />
            </div>
            <div className="flex items-center space-x-4">
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
        </div>
      </div>
  );
};

export default Settings;
