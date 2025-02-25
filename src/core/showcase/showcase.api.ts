import { getErrorCode, makeCall } from "../../utils/makeCall";
import { showCaseErrorMessages } from "./showcase.errors";
import { ShowCaseRequest, ShowCaseResponse } from "./showcase.types";

export const getShowCaseList = (arg1: number, arg2: string) => {
  return makeCall<ShowCaseRequest, ShowCaseResponse>("/path", "GET", {
    arg1,
    arg2,
  });
};
