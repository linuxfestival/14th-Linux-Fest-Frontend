import {makeCall} from "../../utils/makeCall.ts";
import {
    FinalizePaymentRequest,
    FinalizePaymentResponse,
    PaymentDto,
    VerifyPaymentRequest,
    VerifyPaymentResponse
} from "./payment.dto.ts";


export const getPaymentList = makeCall<undefined, PaymentDto[]>(
    "api/payments/get_list/",
    "GET",
)

export const finalizePayment = makeCall<FinalizePaymentRequest, FinalizePaymentResponse>(
    "api/payments/pay_all/",
    "POST",
);

export const verifyPayment = makeCall<VerifyPaymentRequest, VerifyPaymentResponse>(
    "api/payments/verify/",
    "POST",
)