import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosResponse} from "axios";
import {AuthErrorCodes, AuthErrorMessages} from "../auth/auth.errors.ts";
import {FAQDto} from "./users.dto.ts";
import {getFAQ} from "./users.api.ts";

export const getFAQThunk = createAsyncThunk(
    "faq",
    async (_, {rejectWithValue}) => {
        try {
            const response: AxiosResponse<FAQDto[]> = await getFAQ();
            return response.data;
        } catch (error: any) {
            const errorMessage = error.message as AuthErrorCodes;

            if (errorMessage && AuthErrorMessages[errorMessage]) {
                return rejectWithValue(AuthErrorMessages[errorMessage]);
            } else {
                return rejectWithValue("An unexpected error occurred. Please try again.");
            }
        }
    }
);