import { makeCall } from "../../utils/makeCall.ts";
import {PresentationDto, PresentationRequest, PresenterDto} from "./presentations.dto.ts";

export const getAllPresentations = makeCall<void, PresentationDto[]>(
  "/api/presentations/all/",
  "GET"
);

export const getAllPresenters = makeCall<void, PresenterDto[]>(
  "/api/presenter/",
  "GET"
);

export const getPresentationByID = makeCall<
  PresentationRequest,
  PresentationDto
>((params) => `/api/presentations/${params.id}`, "GET");
