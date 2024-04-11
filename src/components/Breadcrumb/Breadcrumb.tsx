import { FC } from "react";
import { Breadcrumb } from "antd";
import StarsCounter from "../StarsCounter/StarsCounter";
import { Link } from "react-router-dom";
import { BreadcrumbItemStyle } from "./styles";
import { useAppSelector } from "src/store/store";

/* const BASE_URL = process.env.VITE_BASE_URL as string; */

const BASE_URL = "https://github.com";

const RepoBreadcrumb: FC = ({}) => {
  const { owner, repo } = useAppSelector((state) => state.issues);

  const ownerUrl = `${BASE_URL}/${owner}`;
  const repoUrl = `${BASE_URL}/${owner}/${repo}`;

  if (!owner || !repo) return;

  const items = [
    {
      title: (
        <Link to={ownerUrl} target="_blank" rel="noopener noreferrer" style={BreadcrumbItemStyle}>
          {owner}
        </Link>
      ),
    },
    {
      type: "separator",
      separator: <div>{">"}</div>,
    },
    {
      title: (
        <Link to={repoUrl} target="_blank" rel="noopener noreferrer" style={BreadcrumbItemStyle}>
          {repo}
        </Link>
      ),
    },
    {
      title: (
        <span style={{ marginLeft: "10px" }}>
          <StarsCounter />
        </span>
      ),
    },
  ];

  // @ts-ignore
  return <Breadcrumb items={items} separator="" />;
};

export default RepoBreadcrumb;
