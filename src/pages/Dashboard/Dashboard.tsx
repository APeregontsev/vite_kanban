import { FC } from "react";
import { Layout } from "antd";
import { BoardToRender, getCurrentBoardToRender } from "./helper";
const { Content } = Layout;
import { DashboardWrapperStyles, ContentWrapperStyles } from "./styles";
import BoardColumn from "src/components/BoardColumn/BoardColumn";
import AppHeader from "src/components/Header/Header";
import IssueCard from "src/components/IssueCard/IssueCard";
import { IssueData } from "src/store/slices/types";
import { useAppSelector } from "src/store/store";

const Dashboard: FC = () => {
  // Had to store data in two separate slices
  // to adjust saving to localStorage only Board info, without issues data
  const boards = useAppSelector((state) => state.boards);
  const issues = useAppSelector((state) => state.issues);

  const boardToRender = getCurrentBoardToRender({ boards, issues });
  const columnsForRender = Object.keys(boardToRender) as Array<keyof BoardToRender>;

  return (
    <Layout style={DashboardWrapperStyles}>
      <AppHeader />

      <Content style={ContentWrapperStyles}>
        {columnsForRender.map((column) => {
          return (
            <BoardColumn title={column} key={column}>
              {boardToRender[column].map((issue: IssueData) => {
                return (
                  <IssueCard
                    key={issue.id}
                    id={issue.id}
                    title={issue.title}
                    issueNumber={issue.number}
                    issueDate={issue.created_at}
                    author={issue.user}
                    numberComments={issue.comments}
                    board={column}
                  />
                );
              })}
            </BoardColumn>
          );
        })}
      </Content>
    </Layout>
  );
};

export default Dashboard;
