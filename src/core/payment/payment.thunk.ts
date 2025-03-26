import {createAsyncThunk} from "@reduxjs/toolkit";
import {SignupRequest, SignupResponse} from "../auth/auth.dto.ts";
import {AxiosResponse} from "axios";
import {signup} from "../auth/auth.api.ts";
import {AuthErrorCodes, AuthErrorMessages} from "../auth/auth.errors.ts";
import {finalizePayment, getPaymentList, verifyPayment} from "./payment.api.ts";
import {
    FinalizePaymentRequest,
    FinalizePaymentResponse,
    PaymentDto,
    VerifyPaymentRequest,
    VerifyPaymentResponse
} from "./payment.dto.ts";

export const getPaymentListThunk = createAsyncThunk(
    "payment/get_list",
    async (_, {rejectWithValue}) => {
        try {
            // Ensure passwords match before making an API call


            // Call the API to register the user
            const response: AxiosResponse<PaymentDto[]> = await getPaymentList();

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

export const finalizePaymentThunk = createAsyncThunk(
    "payment/finalize_payment",
    async (request: FinalizePaymentRequest, {rejectWithValue}) => {
        try {
            // Ensure passwords match before making an API call


            // Call the API to register the user
            const response: AxiosResponse<FinalizePaymentResponse> = await finalizePayment(request);

            return response.data;
        } catch (error: any) {
            // TODO: Error handling
            const errorMessage = error?.response?.data;
            return rejectWithValue(errorMessage || "An unexpected error occurred. Please try again.");
        }
    }
);

export const verifyPaymentThunk = createAsyncThunk(
    "payment/verify_payment",
    async (request: VerifyPaymentRequest, {rejectWithValue}) => {
        try {
            // Ensure passwords match before making an API call


            // Call the API to register the user
            const response: AxiosResponse<VerifyPaymentResponse> = await verifyPayment(request);

            return response.data;
        } catch (error: any) {
            // TODO: Error handling
            const errorMessage = error.message as AuthErrorCodes;

            if (errorMessage && AuthErrorMessages[errorMessage]) {
                return rejectWithValue(AuthErrorMessages[errorMessage]);
            } else {
                return rejectWithValue("An unexpected error occurred. Please try again.");
            }
        }
    }
);