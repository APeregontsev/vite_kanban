import { TInitialState } from "src/store/slices/issues";
import { BoardData, IssueData } from "src/store/slices/types";

export type BoardToRender = {
  inProgress: IssueData[];
  closed: IssueData[];
  open: IssueData[];
};

export type State = {
  issues: TInitialState;
  boards: {
    data: BoardData[];
  };
};

export function getCurrentBoardToRender(state: State): BoardToRender {
  // Board data synced with localStorage in state

  const currentBoardState = state.boards.data.find(
    (board) => board.owner === state.issues.owner && board.repo === state.issues.repo
  );

  // Initialize the board to render with explicit typing
  const boardToRender: BoardToRender = { open: [], inProgress: [], closed: [] };

  // If we havent found Board data in storage/state
  if (!currentBoardState) {
    state.issues.issues.forEach((issue) => {
      const newState = issue.state as keyof BoardToRender;
      boardToRender[newState].push({ ...issue });
    });
    return boardToRender;
  }

  // Lets populate arrays with issues' data according to Boards data (issues ids in proper order)
  const cloneIssueWithNewState = (issue: IssueData, newState: keyof BoardToRender): IssueData => ({
    ...issue,
    state: newState as any["state"],
  });

  (Object.keys(boardToRender) as Array<keyof BoardToRender>).forEach((newState) => {
    currentBoardState[newState].forEach((issueId) => {
      const issue = state.issues.issues.find((issue) => issue.id === issueId);
      if (issue) {
        boardToRender[newState].push(cloneIssueWithNewState(issue, newState));
      }
    });
  });

  return boardToRender;
}
