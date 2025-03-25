import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
    getUserByPhone,
    updateUser,
    changePassword,
    getFAQ,
} from "./users.api" // Adjust the import path as needed
import { AuthErrorCodes, AuthErrorMessages } from "../auth/auth.errors.ts";
import {ChangePasswordRequest, ChangePasswordResponse, FAQDto, UserDto} from "./users.dto.ts"; // Adjust the import path as needed

export const getUserByPhoneThunk = createAsyncThunk(
    "user/getByPhone",
    async (phone_number: string, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<UserDto> = await getUserByPhone(null, {phone_number});
            return response.data;
        } catch (error: any) {
            const errorMessage = error.message as AuthErrorCodes;
            return rejectWithValue(AuthErrorMessages[errorMessage] || "An unexpected error occurred. Please try again.");
        }
    }
);

export const updateUserThunk = createAsyncThunk(
    "user/update",
    async (userData: UserDto & {phone_number: string}, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<UserDto> = await updateUser(userData, {phone_number: userData.phone_number});
            return response.data;
        } catch (error: any) {
            const errorMessage = error.message as AuthErrorCodes;
            return rejectWithValue(AuthErrorMessages[errorMessage] || "An unexpected error occurred. Please try again.");
        }
    }
);

export const changePasswordThunk = createAsyncThunk(
    "user/changePassword",
    async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<ChangePasswordResponse> = await changePassword(passwordData);
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data;
            return rejectWithValue(errorMessage || "An unexpected error occurred. Please try again.");
        }
    }
);

export const getFAQThunk = createAsyncThunk(
    "faq/get",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<FAQDto[]> = await getFAQ();
            return response.data;
        } catch (error: any) {
            const errorMessage = error.message as AuthErrorCodes;
            return rejectWithValue(AuthErrorMessages[errorMessage] || "An unexpected error occurred. Please try again.");
        }
    }
);
