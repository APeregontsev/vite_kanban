import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IssueData } from "./types";

export type TInitialState = {
  issues: IssueData[];
  owner: string;
  repo: string;
};

export const initialState: TInitialState = {
  issues: [],
  owner: "",
  repo: "",
};

// Slice
const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setInitialData(state, action: PayloadAction<TInitialState>) {
      state.issues = action.payload.issues;
      state.owner = action.payload.owner;
      state.repo = action.payload.repo;
    },
  },
});

export const { setInitialData } = issuesSlice.actions;
export const issuesReducer = issuesSlice.reducer;
