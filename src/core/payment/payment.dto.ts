import {AccessoryDto} from "../cart/cart.api";
import {PresentationDto} from "../presentations/presentations.dto.ts";

export type PaymentState = "COMPLETED" | "PENDING" | "FAILED";
export type PaymentStatus = "success" | "unexpected" | "failed";

export interface ParticipationDto {
    "id": number;
    "presentation": PresentationDto,
    "payment_state": PaymentState,
    "user": number
}

export interface PaymentDto {
    id: number;
    total_price: number;
    payment_state: PaymentState;
    authority: string;
    pay_link: string;
    ref_id: string;
    card_pan: string;
    created_date: Date;
    verified_date: Date;
    user: number;
    coupon: string;
    participations: ParticipationDto[];
}

export interface FinalizePaymentRequest {
    coupon: string;
    accessories: AccessoryDto["id"][];
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
