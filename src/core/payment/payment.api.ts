import { makeCall } from "../../utils/makeCall.ts";
import {
  FinalizePaymentRequest,
  FinalizePaymentResponse,
  PaymentDto,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "./payment.dto.ts";

export const getPaymentList = makeCall<undefined, PaymentDto[]>(
  "api/payments/get_list/",
  "GET",
  true
);

export const finalizePayment = makeCall<
  FinalizePaymentRequest,
  FinalizePaymentResponse
>("api/payments/pay_all/", "POST", true);

export const verifyPayment = makeCall<
  VerifyPaymentRequest,
  VerifyPaymentResponse
>("api/payments/verify/", "POST", true);

export const registerCompetition = makeCall<undefined, undefined>(
  "/api/users/competition_signup/",
  "POST",
  true
);
