import {makeCall} from "../../utils/makeCall.ts";
import {AddParticipationResponse, CartItemDto, PresentationDto, RemoveParticipationResponse} from "./presentations.dto.ts";

export const addParticipation = makeCall<null, AddParticipationResponse>(
    (params) => `/api/presentations/${params.id}/add_participation/`,
    "POST",
    true
);

export const removeParticipation = makeCall<null, RemoveParticipationResponse>(
    (params) => `/api/presentations/${params.id}/remove_participation/`,
    "DELETE",
    true
);
export const getAllPresentations = makeCall<void, PresentationDto[]>(
    "/api/presentations/all/",
    "GET"
);

export const getCartPresentations = makeCall<void, CartItemDto[]>(
    "/api/presentations/cart/",
    "GET",
    true
);
