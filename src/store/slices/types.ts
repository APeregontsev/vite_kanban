export type TState = "inProgress" | "open" | "closed";

export type IssueData = {
  id: number;
  number: number;
  title: string;
  comments: number;
  state: TState;
  created_at: string;
  user: string;
};

export type BoardData = {
  inProgress: number[];
  open: number[];
  closed: number[];
  owner: string;
  repo: string;
};
