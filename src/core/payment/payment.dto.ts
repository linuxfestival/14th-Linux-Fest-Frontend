export type PaymentState = "COMPLETED" | "PENDING" | "FAILED"
export type PaymentStatus = "success" | "unexpected" | "failed";

export interface PaymentDto {
    "id": number;
    "total_price": number;
    "payment_state": PaymentState;
    "authority": string;
    "pay_link": string;
    "ref_id": string;
    "card_pan": string;
    "created_date": Date;
    "verified_date": Date;
    "user": number;
    "coupon": string;
    "participations": number[];
}

export interface FinalizePaymentRequest {
    coupon: string;
}

export interface FinalizePaymentResponse {
    payment_url?: string;
    authority?: string;
    detail?: string;
}

export interface VerifyPaymentRequest {
    authority: string;
}

export interface VerifyPaymentResponse {
    status: PaymentStatus;
    ref_id?: string;
    error?: string;
    card_pan?: string;
}

