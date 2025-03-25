import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FAQDto} from "./users.dto";
import {getFAQThunk} from "./users.thunk.ts";

interface usersState {
    faqs: FAQDto[];
    loading: boolean;
    error: string | null;
}

const initialState: usersState = {
    faqs: [],
    loading: false,
    error: null,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFAQThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFAQThunk.fulfilled, (state, action: PayloadAction<FAQDto[]>) => {
                state.loading = false;
                state.faqs = action.payload;
            })
            .addCase(getFAQThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default usersSlice.reducer;
