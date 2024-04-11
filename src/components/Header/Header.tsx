import { FC } from "react";
import { Layout, Flex } from "antd";
const { Header } = Layout;
import RepoBreadcrumb from "../Breadcrumb/Breadcrumb";
import { HeaderWrapperStyles } from "./styles";
import Search from "../Search/Search";

const AppHeader: FC = ({}) => {
  return (
    <Header style={HeaderWrapperStyles}>
      <Flex vertical>
        <Search />
        <RepoBreadcrumb />
      </Flex>
    </Header>
  );
};

export default AppHeader;
