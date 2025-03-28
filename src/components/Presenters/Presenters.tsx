import Header from "../Header/Header.tsx";
import Footer from "../Footer/Footer.tsx";
import React, {useEffect} from "react";
import {PresenterCard} from "../Workshop/Workshop.tsx";
import {RootState, useAppDispatch} from "../../store.ts";
import {getAllPresentersThunk} from "../../core/presentations/presentations.thunk.ts";
import {useSelector} from "react-redux";
import Skeleton from "../Skeleton/Skeleton.tsx";

export const Presenters = () => {

    const dispatch = useAppDispatch();

    const {presenters, loading} = useSelector((state: RootState) => state.presentation);

    useEffect(() => {
        dispatch(getAllPresentersThunk())
    }, [dispatch]);

    return (
        <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center bg-pattern">
            <Header/>

            <div
                className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-hidden h-max mt-32 mb-8 pb-16">
                {loading ?
                    (
                        [...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-4 my-4 bg-bg-secondary p-10 px-20 rounded-xl justify-center items-center">
                                <div className="rounded-full overflow-hidden">
                                    <Skeleton width={120} height={120}/>
                                </div>
                                <Skeleton width={100} height={10}/>
                                <div className="rounded-full overflow-hidden">
                                    <Skeleton width={100} height={30}/>
                                </div>
                            </div>
                        ))

                    ) : presenters && presenters.map((el, index) => (
                    <PresenterCard
                        key={index}
                        avatar={el.avatar}
                        name={`${el.first_name} ${el.last_name}`}
                        description={el.description}
                    />
                ))}
            </div>

            <Footer/>
        </div>
    )
}