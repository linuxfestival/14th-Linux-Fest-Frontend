import React from "react";
import Header from "../Header/Header";
import WorkshopCard from "./components/WorkshopCard";

const Workshops = () => {
  return (
    <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern">
      <div className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-auto h-[80dvh] mt-28 pb-8">
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
        <WorkshopCard />
      </div>

      <Header />
    </div>
  );
};

export default Workshops;
