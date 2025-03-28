import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPresentationsThunk, getAllPresentersThunk,
  getPresentationByIDThunk,
} from "./presentations.thunk";
import {PresentationDto, PresenterDto} from "./presentations.dto";

interface PresentationsState {
  list: PresentationDto[];
  currentPresentation: PresentationDto | undefined;
  loading: boolean;
  loadedFirstTime: boolean;
  presenters: PresenterDto[];
}

const initialState: PresentationsState = {
  list: [],
  currentPresentation: undefined,
  loading: false,
  loadedFirstTime: false,
  presenters: []
};

const presentationsSlice = createSlice({
  name: "presentations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPresentationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPresentationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.loadedFirstTime = true;
      })
      .addCase(getAllPresentationsThunk.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getPresentationByIDThunk.pending, (state, action) => {
        state.currentPresentation = undefined;
      })
      .addCase(getPresentationByIDThunk.fulfilled, (state, action) => {
        state.currentPresentation = action.payload;
      })
      .addCase(getPresentationByIDThunk.rejected, (state) => {
        state.currentPresentation = undefined;
      })
      .addCase(getAllPresentersThunk.pending, (state, action) => {
        state.currentPresentation = undefined;
        state.loading = true
      })
      .addCase(getAllPresentersThunk.fulfilled, (state, action) => {
        state.presenters = action.payload;
        state.loading = false
      })
      .addCase(getAllPresentersThunk.rejected, (state) => {
        state.loading = false
      });
  },
});

export default presentationsSlice.reducer;
