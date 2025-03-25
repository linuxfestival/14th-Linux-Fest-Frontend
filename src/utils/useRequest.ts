import { AsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

export const useRequest = <ThunkInput = void, ThunkOutput = void>(
  thunk: AsyncThunk<ThunkOutput, ThunkInput, any>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    (args: ThunkInput) => {
      setLoading(true);
      return dispatch(thunk(args))
        .then(unwrapResult)
        .finally(() => setLoading(false));
    },
    [dispatch, thunk]
  );

  return { loading, sendRequest };
};
