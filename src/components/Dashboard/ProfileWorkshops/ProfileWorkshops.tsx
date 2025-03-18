import React from "react";
import RegisteredWorkshop, {
  WorkshopStatus,
} from "./Components/RegisteredWorkshop";

const ProfileWorkshops = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full w-full">
      <h1 className="text-4xl font-bold mb-6">کارگاه های من</h1>
      <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
        <RegisteredWorkshop
          title="تست"
          time="۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰"
          status={WorkshopStatus.NOT_STARTED}
        />
        <RegisteredWorkshop
          title="تست"
          time="۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰"
          status={WorkshopStatus.FINISHED}
        />
        <RegisteredWorkshop
          title="تست"
          time="۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰"
          status={WorkshopStatus.IN_PROGRESS}
        />
        <RegisteredWorkshop
          title="تست"
          time="۱۴۰۴/۰۱/۲۵ - ۱۶:۰۰ ۱۸:۰۰"
          status={WorkshopStatus.IN_PROGRESS}
          live
        />
      </div>
    </div>
  );
};

export default ProfileWorkshops;
