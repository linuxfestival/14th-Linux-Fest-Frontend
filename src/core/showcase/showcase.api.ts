import { getErrorCode, makeCall } from "../../utils/makeCall";
import { showCaseErrorMessages } from "./showcase.errors";
import { ShowCaseRequest, ShowCaseResponse } from "./showcase.types";

export const getShowCaseList = (reqParams: ShowCaseRequest) => {
  return makeCall<ShowCaseRequest, ShowCaseResponse>("/path", "GET", {
    ...reqParams,
  })
    .then((res) => res.data)
    .catch((error) => getErrorCode(error.message));
};
