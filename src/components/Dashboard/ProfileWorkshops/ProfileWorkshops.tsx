import React, {useEffect} from "react";
import RegisteredWorkshop from "./Components/RegisteredWorkshop";
import {RootState, useAppDispatch} from "../../../store.ts";
import {getCartPresentationsThunk} from "../../../core/presentations/presentations.think.ts";
import {useSelector} from "react-redux";
import Lottie from "lottie-react";
import notFound from "../../../assets/lottie/notFound.json"

const ProfileWorkshops = () => {
    const dispatch = useAppDispatch()

    const {cart} = useSelector((root: RootState) => root.presentation)

    useEffect(() => {
        dispatch(getCartPresentationsThunk())
    }, [dispatch]);

    return (
        <div className="flex flex-col justify-center items-center gap-4 h-full w-full">
            <h1 className="text-4xl font-bold mb-6">کارگاه های من</h1>
            <div className="flex flex-col gap-4 items-center justify-start overflow-auto h-full w-full px-4">
                {cart.filter(el => el.payment_state === "COMPLETED").map(el => (
                    <RegisteredWorkshop
                        title={el.presentation.title}
                        time={new Date(el.presentation.start)}
                    />
                ))}
                {cart.filter(el => el.payment_state === "COMPLETED").length === 0 &&
                    <>
                        <Lottie animationData={notFound}/>
                        <p className="text-2xl font-bold">کارگاهی یافت نشد!</p>
                    </>
                }
            </div>
        </div>
    );
};

export default ProfileWorkshops;
