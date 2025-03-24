import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    addParticipationThunk,
    removeParticipationThunk,
    getAllPresentationsThunk,
    getCartPresentationsThunk,
} from "./presentations.think";
import { PresentationDto, CartItemDto } from "./presentations.dto";

interface PresentationsState {
    presentations: PresentationDto[];
    cart: CartItemDto[];
    loading: boolean;
    error: string | null;
}

const initialState: PresentationsState = {
    presentations: [],
    cart: [],
    loading: false,
    error: null,
};

const presentationsSlice = createSlice({
    name: "presentations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllPresentationsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPresentationsThunk.fulfilled, (state, action: PayloadAction<PresentationDto[]>) => {
                state.loading = false;
                state.presentations = action.payload;
            })
            .addCase(getAllPresentationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getCartPresentationsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartPresentationsThunk.fulfilled, (state, action: PayloadAction<CartItemDto[]>) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(getCartPresentationsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addParticipationThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addParticipationThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addParticipationThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeParticipationThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeParticipationThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeParticipationThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default presentationsSlice.reducer;
