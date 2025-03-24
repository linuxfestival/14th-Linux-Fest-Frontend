import React, {useEffect} from "react";
import Header from "../Header/Header";
import WorkshopCard from "./components/WorkshopCard";
import {useAppDispatch} from "../../store.ts";

const Workshops = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {

    }, []);

    return (
        <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern">
            <div className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-auto h-[80dvh] mt-28 pb-8">
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
                <WorkshopCard/>
            </div>

            <Header/>
        </div>
    );
};

export default Workshops;
