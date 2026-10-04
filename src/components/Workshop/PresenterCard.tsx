import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import Button from "../Common/Button/Button";

interface PresenterCardProps {
  avatar: string;
  name: string;
  description: string;
  linkedin?: string;
}

export const PresenterCard = ({
  avatar,
  name,
  description,
  linkedin,
}: PresenterCardProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="flex flex-col justify-center items-center gap-2 text-center px-4 py-4 bg-bg-secondary rounded-xl w-[300px] h-[300px] shadow-xl">
      <img
        src={avatar}
        className="w-[120px] h-[120px] rounded-full object-cover"
      />
      <h1 className="text-xl font-extrabold text-text-gray mt-2">{name}</h1>
      <Button className="!bg-indigo mt-2" onClick={() => setShowModal(true)}>
        اطلاعات بیشتر
      </Button>

      {showModal &&
        createPortal(
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-999">
            <div
              className="fixed w-full h-full bg-black/20 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <div className="w-full sm:w-2/3 md:w-1/2 max-h-[800px] h-max flex flex-col gap-6 bg-bg-secondary px-8 py-8 rounded-xl z-999">
              <div className="w-full flex flex-row-reverse justify-between">
                <IoCloseOutline
                  size={24}
                  className="cursor-pointer mr-4"
                  onClick={() => setShowModal(false)}
                />
                <div className="w-full flex justify-start items-center gap-4 mt-4 px-4">
                  <img
                    src={avatar}
                    className="w-[120px] h-[120px] rounded-full object-cover"
                  />
                  <h1 className="text-2xl font-bold text-white">{name}</h1>
                </div>
              </div>
              <div
                className="w-full h-max mt-4 text-xl text-white text-center"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <div className="flex justify-center gap-4">
                {linkedin && (
                  <Link to={linkedin} target={"_blank"}>
                    <FaLinkedin className="text-secondary" size={50} />
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};


