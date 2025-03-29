import React, { useEffect, useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  // const [show, setShow] = useState(false);

  useEffect(() => {
    const handleGoftinoReady = () => {
      //@ts-ignore
      const goftino = Goftino;
      if (goftino) {
        // goftino.setWidget({
        // });
        // setShow(true);
      }
    };

    window.addEventListener("goftino_ready", handleGoftinoReady);

    return () => {
      window.removeEventListener("goftino_ready", handleGoftinoReady);
    };
  }, []);

  return (
    <>
      <Outlet />
      {/* {show && (
        <div
          className="absolute bottom-10 left-10 cursor-pointer w-[60px] h-[60px] flex justify-center items-center bg-secondary p-2 rounded-full"
          onClick={() => {
            //@ts-ignore
            window.Goftino.open();
          }}
        >
          <MdOutlineSupportAgent size={50} />
        </div>
      )} */}
    </>
  );
};

export default MainLayout;
