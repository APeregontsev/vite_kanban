import { FC, ReactNode } from "react";
import { Col, Flex, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "src/store/store";
import { changeOrder } from "src/store/slices/board";
import { useDragNDrop } from "src/Hooks/useDragndrop";
import { ColumnItemsWrapper, ColumnTitlerStyles, ColumnWrapperStyles } from "./styles";

type TBoardColumn = { children?: ReactNode; title: "inProgress" | "closed" | "open" };

const BoardColumn: FC<TBoardColumn> = ({ children, title }) => {
  const dispatch = useAppDispatch();
  const { owner, repo } = useAppSelector((state) => state.issues);

  const { dragOverHighlight, dragHandlers } = useDragNDrop({
    onSendDroppedData: (data) =>
      dispatch(
        changeOrder({
          issueId: +data,
          owner,
          repo,
          newColumn: title,
        })
      ),
  });

  const titleText = title === "closed" ? "Done" : title;

  return (
    <Col span={8} style={ColumnWrapperStyles}>
      <Typography.Title level={4} style={ColumnTitlerStyles}>
        {titleText}
      </Typography.Title>

      <Flex
        style={{ ...ColumnItemsWrapper, ...(dragOverHighlight ? { backgroundColor: "#e9848424" } : {}) }}
        {...dragHandlers}
      >
        {children}
      </Flex>
    </Col>
  );
};

export default BoardColumn;
