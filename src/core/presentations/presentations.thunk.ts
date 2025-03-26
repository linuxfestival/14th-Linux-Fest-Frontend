import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPresentations } from "./presentations.api.ts";
import { AxiosResponse } from "axios";
import { PresentationDto } from "./presentations.dto.ts";

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
