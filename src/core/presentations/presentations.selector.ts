import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectPresentationsState = (state: RootState) => state.presentation;

export const selectPresentationById = (id: number) =>
  createSelector([selectPresentationsState], (presentations) =>
    presentations.list.find((presentation) => presentation.id === id)
  );

export const selectIsPresentationLoading = createSelector(
  [selectPresentationsState],
  (presentations) => presentations.loading
);
