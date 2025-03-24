import {AuthErrorCodes, AuthErrorMessages} from "../auth/auth.errors.ts";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {addParticipation, getAllPresentations, getCartPresentations, removeParticipation} from "./presentations.api.ts";
import {AxiosResponse} from "axios";
import {AddParticipationResponse, CartItemDto, PresentationDto, RemoveParticipationResponse} from "./presentations.dto.ts";

export const addParticipationThunk = createAsyncThunk(
    "presentations/add_participation",
    async (id: number , {rejectWithValue}) => {
        try {
            const response: AxiosResponse<AddParticipationResponse> = await addParticipation(null, {id});
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
export const removeParticipationThunk = createAsyncThunk(
    "presentations/remove_participation",
    async (id: number, {rejectWithValue}) => {
        try {
            const response: AxiosResponse<RemoveParticipationResponse> = await removeParticipation(null, {id});
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
export const getAllPresentationsThunk = createAsyncThunk(
    "presentations/get_all",
    async (_, {rejectWithValue}) => {
        try {
            const response: AxiosResponse<PresentationDto[]> = await getAllPresentations();
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

export const getCartPresentationsThunk = createAsyncThunk(
    "presentations/get_cart",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<CartItemDto[]> = await getCartPresentations();
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
