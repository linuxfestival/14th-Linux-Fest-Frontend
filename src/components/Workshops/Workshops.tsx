import React, { useEffect } from "react";
import Header from "../Header/Header";
import WorkshopCard, { WorkshopCardSkeleton } from "./components/WorkshopCard";
import { RootState, useAppDispatch } from "../../store.ts";
import { getAllPresentationsThunk } from "../../core/presentations/presentations.thunk.ts";
import { useSelector } from "react-redux";
import { getCartThunk } from "../../core/cart/cart.thunk.ts";
import { selectIsPresentationLoading } from "../../core/presentations/presentations.selector.ts";
import { selectIsAuthenticated } from "../../core/auth/auth.selector.ts";

const Workshops = () => {
  const dispatch = useAppDispatch();
  const presentationLoading = useSelector(selectIsPresentationLoading);
  const { list: presentations } = useSelector(
    (state: RootState) => state.presentation
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(getAllPresentationsThunk());
    if (isAuthenticated) {
      dispatch(getCartThunk());
    }
  }, []);

  return (
    <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern">
      <div className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-auto h-[80dvh] mt-28 pb-8">
        {presentationLoading
          ? Array(6)
              .fill(6)
              .map(() => <WorkshopCardSkeleton />)
          : presentations.map((presentation, index) => (
              <WorkshopCard
                key={index}
                dateTime={new Date(presentation.start).toLocaleString("fa")}
                id={presentation.id}
                title={presentation.title}
                description={presentation.description}
                instructor={presentation.presenters
                  .map((el) => `${el.first_name} ${el.last_name}`)
                  .join(" و ")}
                price={presentation.cost}
                showAddToCart={presentation.remained_capacity > 0}
                tags={[]}
                presentation={presentation}
              />
            ))}
      </div>

      <Header />
    </div>
  );
};

export default Workshops;
