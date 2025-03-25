import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FAQDto, UserDto, ChangePasswordResponse } from "./users.dto";
import {
    getFAQThunk,
    getUserByPhoneThunk,
    updateUserThunk,
    changePasswordThunk,
} from "./users.thunk.ts";

interface UsersState {
    faqs: FAQDto[];
    user: UserDto | null;
    loading: boolean;
    error: string | null;
    passwordChangeSuccess: boolean;
}

const initialState: UsersState = {
    faqs: [],
    user: null,
    loading: false,
    error: null,
    passwordChangeSuccess: false,
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
            })
            .addCase(getUserByPhoneThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserByPhoneThunk.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUserByPhoneThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserThunk.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(changePasswordThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.passwordChangeSuccess = false;
            })
            .addCase(changePasswordThunk.fulfilled, (state, action: PayloadAction<ChangePasswordResponse>) => {
                state.loading = false;
                state.passwordChangeSuccess = true;
            })
            .addCase(changePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.passwordChangeSuccess = false;
            });
    },
});

export default usersSlice.reducer;