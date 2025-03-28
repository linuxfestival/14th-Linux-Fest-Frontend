import { createSlice } from "@reduxjs/toolkit";
import {
  getAllPresentationsThunk,
  getPresentationByIDThunk,
} from "./presentations.thunk";
import { PresentationDto } from "./presentations.dto";

interface PresentationsState {
  list: PresentationDto[];
  currentPresentation: PresentationDto | undefined;
  loading: boolean;
  loadedFirstTime: boolean;
}

const initialState: PresentationsState = {
  list: [],
  currentPresentation: undefined,
  loading: false,
  loadedFirstTime: false,
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
      });
  },
});

export default presentationsSlice.reducer;
