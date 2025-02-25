import { ofType } from "redux-observable";
import { of } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { login } from "./auth.store";
import { ajax } from "rxjs/ajax";
import { AnyAction } from "redux";
import { getShowCaseList } from "../showcase/showcase.api";

const loginEpic = (action$: any) =>
  action$.pipe(
    ofType(login.type),
    mergeMap((action: AnyAction) =>
      getShowCaseList(21, "test").pipe(
        mergeMap((response) => of(login(response.arg1))),
        catchError((error) => of({ type: "LOGIN_FAILED", payload: error }))
      )
    )
  );

export default loginEpic;
