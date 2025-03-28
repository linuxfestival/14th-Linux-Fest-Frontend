import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const selectPresentationsState = (state: RootState) =>
  state.presentation;

export const selectPresentationById = (id: number) =>
  createSelector([selectPresentationsState], (presentations) =>
    presentations.list.find((presentation) => presentation.id === id)
  );

export const selectIsPresentationLoading = createSelector(
  [selectPresentationsState],
  (presentations) => presentations.loading
);

export const selectCurrentPresentation = createSelector(
  [selectPresentationsState],
  (presentations) => presentations.currentPresentation
);
