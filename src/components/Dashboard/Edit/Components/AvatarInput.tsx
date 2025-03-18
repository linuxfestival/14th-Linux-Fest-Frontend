import React, { useState } from "react";
import defaultAvatar from "../../../../assets/images/pinguin.png";
import Camera from "../../../Common/icons/Camera";
import clsx from "clsx";

interface Props {
  className?: string;
}

const AvatarInput = ({ className }: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center w-full max-w-xl",
        className
      )}
    >
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
  );
};

export default AvatarInput;
