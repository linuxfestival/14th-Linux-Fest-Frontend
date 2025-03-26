import { createSlice } from "@reduxjs/toolkit";
import { getAllPresentationsThunk } from "./presentations.thunk";
import { PresentationDto } from "./presentations.dto";

interface PresentationsState {
  list: PresentationDto[];
  loading: boolean;
}

const initialState: PresentationsState = {
  list: [],
  loading: false,
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
      })
      .addCase(getAllPresentationsThunk.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default presentationsSlice.reducer;
