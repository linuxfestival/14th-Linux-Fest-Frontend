import React, {useEffect} from "react";
import Header from "../Header/Header";
import WorkshopCard from "./components/WorkshopCard";
import {RootState, useAppDispatch} from "../../store.ts";
import {getAllPresentationsThunk} from "../../core/presentations/presentations.think.ts";
import {useSelector} from "react-redux";

const Workshops = () => {
    const dispatch = useAppDispatch();
    const {presentations} = useSelector((state: RootState) => state.presentation);

    useEffect(() => {
        dispatch(getAllPresentationsThunk())
    }, [dispatch]);


    return (
        <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern">
            <div className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-auto h-[80dvh] mt-28 pb-8">
                {presentations.map((presentation, index) => (
                    <WorkshopCard
                        key={index}
                        dateTime={new Date(presentation.start).toLocaleString('fa')}
                        title={presentation.title}
                        description={presentation.description}
                        instructor={presentation.presenters.map(el => `${el.first_name} ${el.last_name}`).join(' و ')}
                        price={presentation.cost}
                        showAddToCart={presentation.remained_capacity > 0}
                        tags={[]}
                        presentation={presentation}
                    />
                ))}
            </div>

            <Header/>
        </div>
    );
};

export default Workshops;
