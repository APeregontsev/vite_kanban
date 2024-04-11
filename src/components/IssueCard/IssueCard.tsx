import { FC } from "react";
import { Card, Flex, Space, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { getDaysAgo } from "./helper";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { changeOrder } from "src/store/slices/board";
import { useDragNDrop } from "src/Hooks/useDragndrop";
import { CardTextStyles, CardWrapperStyles, DragZoneStyles } from "./styles";

type TIssueCard = {
  id: number;
  title: string;
  issueNumber: number;
  issueDate: string;
  author: string;
  numberComments: number;
  board: "inProgress" | "closed" | "open";
};

const IssueCard: FC<TIssueCard> = ({ id, title, issueNumber, issueDate, author, numberComments, board }) => {
  const dispatch = useAppDispatch();
  const { owner, repo } = useAppSelector((state) => state.issues);
  const daysAgoLabel = getDaysAgo(issueDate);

  const { dragOverHighlight, dragStartHighlight, dragHandlers } = useDragNDrop({
    dataToSendOnDrag: id.toString(),
    onSendDroppedData: (data) =>
      dispatch(
        changeOrder({
          issueId: +data,
          referenceIssueId: id,
          owner,
          repo,
          newColumn: board,
        })
      ),
  });

  return (
    <Card
      bordered
      styles={CardWrapperStyles}
      style={{
        ...{ cursor: "default" },
        ...(dragOverHighlight && { backgroundColor: "#e9848424" }),
        ...(dragStartHighlight && { backgroundColor: "#8497e923" }),
      }}
      draggable
      {...dragHandlers}
    >
      <Flex justify="space-between">
        <Typography>
          <Title level={5}>{title}</Title>
          <Paragraph style={CardTextStyles}>
            #{issueNumber} opened {daysAgoLabel}
          </Paragraph>

          <Space align="center">
            <Paragraph style={CardTextStyles}>{author}</Paragraph>
            <Paragraph style={CardTextStyles}>|</Paragraph>
            <Paragraph style={CardTextStyles}>Comments: {numberComments}</Paragraph>
          </Space>
        </Typography>
        <div style={DragZoneStyles}></div>
      </Flex>
    </Card>
  );
};

export default IssueCard;
