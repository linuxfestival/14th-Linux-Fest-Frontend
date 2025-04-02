import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header/Header.tsx";
import WorkshopCard, {
  WorkshopCardSkeleton,
} from "./components/WorkshopCard.tsx";
import { RootState, useAppDispatch } from "../../store.ts";
import { getAllPresentationsThunk } from "../../core/presentations/presentations.thunk.ts";
import { useSelector } from "react-redux";
import { getCartThunk } from "../../core/cart/cart.thunk.ts";
import {
  selectIsPresentationLoading,
  selectPresentationsState,
} from "../../core/presentations/presentations.selector.ts";
import { selectIsAuthenticated } from "../../core/auth/auth.selector.ts";
import Footer from "../Footer/Footer.tsx";
import WorkshopsFilter, { Sort } from "./components/WorkshopsFilter.tsx";
import { PresentationService } from "../../core/presentations/presentations.dto.ts";

// Pined Types
const PinedTypes = [PresentationService.PACKAGE];

const WorkshopsList = () => {
  const dispatch = useAppDispatch();
  const presentationLoading = useSelector(selectIsPresentationLoading);
  const { list: presentations, loadedFirstTime } = useSelector(
    selectPresentationsState
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState<Sort>("SORT_BY_DATE");

  useEffect(() => {
    if (!loadedFirstTime) {
      dispatch(getAllPresentationsThunk());
    }
    if (isAuthenticated) {
      dispatch(getCartThunk());
    }
  }, [loadedFirstTime, isAuthenticated]);

  const pinnedPresentations = useMemo(() => {
    return presentations.filter(
      (presentation) =>
        PinedTypes.includes(presentation.service_type) &&
        presentation.remained_capacity !== 0
    );
  }, [presentations]);

  const [filteredPresentations, fullPresentations] = useMemo(() => {
    const filtered = presentations
      .filter((presentation) =>
        presentation.fa_title.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortType) {
          case "SORT_BY_PRICE":
            return a.remained_capacity === 0 ? 1 : a.cost - b.cost;
          case "SORT_BY_NAME":
            return a.remained_capacity === 0
              ? 1
              : a.fa_title.localeCompare(b.fa_title);
          case "SORT_BY_DATE":
          default:
            return a.remained_capacity === 0
              ? 1
              : new Date(a.start).getTime() - new Date(b.start).getTime();
        }
      });

    const filteredPresentations = filtered.filter(
      (presentation) =>
        presentation.remained_capacity !== 0 &&
        !PinedTypes.includes(presentation.service_type)
    );

    const fullPresentations = filtered.filter(
      (presentation) => presentation.remained_capacity === 0
    );

    console.log("!@!", fullPresentations);
    return [filteredPresentations, fullPresentations];
  }, [presentations, searchText, sortType]);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center bg-pattern">
      <Header />

      <div className="w-3/4 flex justify-center items-center flex-wrap gap-10 overflow-hidden h-max mt-32 mb-8 pb-16">
        <WorkshopsFilter
          onReset={() => {
            setSearchText("");
            setSortType("SORT_BY_DATE");
          }}
          onSearch={setSearchText}
          onSortSelect={setSortType}
        />

        {presentationLoading ? (
          Array(6)
            .fill(null)
            .map((_, index) => <WorkshopCardSkeleton key={index} />)
        ) : (
          <>
            {pinnedPresentations.map((presentation) => (
              <WorkshopCard
                key={presentation.id}
                dateTime={new Date(presentation.start).toLocaleString("fa")}
                id={presentation.id}
                title={presentation.en_title}
                // subTitle={presentation.en_title}
                // TODO: Remove description
                description={presentation.en_description}
                price={presentation.cost}
                tags={presentation.tags}
                pinned
                specialPackage
                banner={presentation.morkopoloyor}
                service_type={presentation.service_type}
                presenters={presentation.presenters}
                remainedCapacity={presentation.remained_capacity}
              />
            ))}
            {filteredPresentations.map((presentation) => (
              <WorkshopCard
                key={presentation.id}
                dateTime={new Date(presentation.start).toLocaleString("fa")}
                id={presentation.id}
                title={presentation.en_title}
                // subTitle={presentation.en_title}
                // TODO: Remove description
                description={presentation.en_description}
                price={presentation.cost}
                tags={presentation.tags}
                banner={presentation.morkopoloyor}
                service_type={presentation.service_type}
                presenters={presentation.presenters}
                remainedCapacity={presentation.remained_capacity}
              />
            ))}
            {fullPresentations.map((presentation) => (
              <WorkshopCard
                key={presentation.id}
                dateTime={new Date(presentation.start).toLocaleString("fa")}
                id={presentation.id}
                title={presentation.en_title}
                // subTitle={presentation.en_title}
                // TODO: Remove description
                description={presentation.en_description}
                price={presentation.cost}
                tags={presentation.tags}
                banner={presentation.morkopoloyor}
                service_type={presentation.service_type}
                presenters={presentation.presenters}
                remainedCapacity={presentation.remained_capacity}
                specialPackage={presentation.service_type === "PACKAGE"}
              />
            ))}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WorkshopsList;
