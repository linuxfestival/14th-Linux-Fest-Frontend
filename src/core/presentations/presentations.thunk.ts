import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllPresentations, getAllPresenters,
    getPresentationByID,
} from "./presentations.api.ts";
import { AxiosResponse } from "axios";
import {PresentationDto, PresenterDto} from "./presentations.dto.ts";

export const getAllPresentationsThunk = createAsyncThunk(
  "presentations/get_all",
  async (_, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<PresentationDto[]> =
        await getAllPresentations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
export const getAllPresentersThunk = createAsyncThunk(
  "presenters/get_all",
  async (_, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<PresenterDto[]> =
        await getAllPresenters();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const getPresentationByIDThunk = createAsyncThunk(
  "presentations/get_by_id",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getPresentationByID(undefined, { id });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
