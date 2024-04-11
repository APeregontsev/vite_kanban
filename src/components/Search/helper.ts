import { toast } from "react-toastify";
import { BoardData, IssueData, TState } from "src/store/slices/types";

export function getRepoDetailsFromURL(url: string) {
  const parts = url.split("/");
  const index = parts.findIndex((urlPart) => urlPart === "github.com");

  if (index === -1) return { owner: "", repo: "" };

  const owner = parts[index + 1];
  const repo = parts[index + 2];

  return { owner, repo };
}

export function notify(message: string) {
  return toast.error(message, { hideProgressBar: true, position: "bottom-right" });
}

type IssueDataExtended = Omit<IssueData, "user"> & {
  assignee: string | null;
  assignees: string[];
  user: {
    login: string;
  };
};

export function transformResponse(data: IssueDataExtended[]): IssueData[] {
  return data.map(
    ({
      id,
      title,
      comments,
      assignee,
      number,
      assignees,
      state,
      created_at,
      user: { login },
    }: IssueDataExtended) => {
      return {
        id,
        number,
        title,
        comments,
        user: login,
        created_at,
        state: assignee || assignees.length ? "inProgress" : state,
      };
    }
  );
}

export function transformDataToBoard(data: any) {
  return data.reduce(
    (acc: Omit<BoardData, "repo" | "owner">, issue: any) => {
      let issueState: TState = issue.assignee || issue.assignees.length ? "inProgress" : issue.state;

      acc[issueState].push(issue.id);

      return acc;
    },
    { inProgress: [], open: [], closed: [] } as Omit<BoardData, "repo" | "owner">
  );
}
