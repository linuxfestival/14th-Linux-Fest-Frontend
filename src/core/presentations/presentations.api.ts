import { makeCall } from "../../utils/makeCall.ts";
import { PresentationDto } from "./presentations.dto.ts";

export const getAllPresentations = makeCall<void, PresentationDto[]>(
  "/api/presentations/all/",
  "GET"
);
