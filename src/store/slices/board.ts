import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardData } from "./types";

export type TChangeOrder = {
  issueId: number;
  newColumn: "inProgress" | "closed" | "open";
  referenceIssueId?: number;
  owner?: string;
  repo?: string;
};

export const initialState: { data: BoardData[] } = {
  data: [{ inProgress: [], open: [], closed: [], owner: "", repo: "" }],
};

// Slice
const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardData(state, action: PayloadAction<BoardData>) {
      const boardPresentInState = state.data.find(
        (board) => board.owner === action.payload.owner && board.repo === action.payload.repo
      );

      if (!boardPresentInState) state.data.push(action.payload);
    },

    changeOrder(state, action: PayloadAction<TChangeOrder>) {
      const { issueId, newColumn, referenceIssueId, owner, repo } = action.payload;

      // Lets exit if we dra-n-drop issue on itself)
      if (issueId === referenceIssueId) return;

      // Deep clone the state to ensure immutability.
      const newState = JSON.parse(JSON.stringify(state));

      // Find the board index for the currentRepo in the newState
      const boardIndex = newState.data.findIndex(
        (board: BoardData) => board.owner === owner && board.repo === repo
      );

      // Proceed only if a corresponding board is found
      if (boardIndex !== -1) {
        // Extract the board for easier manipulation
        const boardChanges: BoardData = newState.data[boardIndex];

        // Remove the issue from its current column
        ["inProgress", "closed", "open"].forEach((column) => {
          const index = ((boardChanges as any)[column] as number[]).indexOf(issueId);
          if (index !== -1) {
            (boardChanges as any)[column].splice(index, 1);
          }
        });

        // Define the insertion index for the issue in the new column
        let insertIndex: number = 0;

        if (newColumn) insertIndex = boardChanges[newColumn].length; // Default to the last position

        // If a referenceIssueId is provided, adjust the insertIndex to place the issue before the reference
        if (referenceIssueId !== undefined) {
          const referenceIndex = boardChanges[newColumn].indexOf(referenceIssueId);
          if (referenceIndex !== -1) {
            insertIndex = referenceIndex;
          }
        }

        // Insert the issue at the calculated index in the new column

        boardChanges[newColumn].splice(insertIndex, 0, issueId);

        // Replace the updated board in the newState
        state.data[boardIndex] = { ...boardChanges };

        return state;
      }
    },
  },
});

export const { setBoardData, changeOrder } = boardSlice.actions;
export const boardsReducer = boardSlice.reducer;
