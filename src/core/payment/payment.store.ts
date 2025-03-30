import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    finalizePaymentThunk,
    getPaymentListThunk,
    verifyPaymentThunk,
} from "./payment.thunk";
import { PaymentDto, FinalizePaymentResponse, VerifyPaymentResponse } from "./payment.dto";

interface PaymentState {
    payments: PaymentDto[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    payments: [],
    loading: false,
    error: null,
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPaymentListThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentListThunk.fulfilled, (state, action: PayloadAction<PaymentDto[]>) => {
                state.loading = false;
                state.payments = action.payload?.sort((first, second) => second.id - first.id) ?? [];
            })
            .addCase(getPaymentListThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(finalizePaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizePaymentThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(finalizePaymentThunk.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPaymentThunk.fulfilled, (state, action: PayloadAction<VerifyPaymentResponse>) => {
                state.loading = false;
            })
            .addCase(verifyPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default paymentSlice.reducer;
