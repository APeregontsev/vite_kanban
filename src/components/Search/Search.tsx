import { FC, useEffect, useState } from "react";
import { Input, Button, Flex } from "antd";
import { getRepoDetailsFromURL, notify, transformDataToBoard, transformResponse } from "./helper";
import { axiosWithAuth } from "src/api/api";
import { setBoardData } from "src/store/slices/board";
import { setInitialData } from "src/store/slices/issues";
import { useAppDispatch } from "src/store/store";
import { useFetching } from "src/Hooks/useFetching";
import { InputStyles } from "./styles";

const Search: FC = ({}) => {
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { owner, repo } = getRepoDetailsFromURL(searchQuery);

  // Loading data from the API
  const {
    fetching: fetchIssues,
    isLoading,
    error,
  } = useFetching(async () => {
    if (!owner || !repo) return notify("Provided wrong repository address");

    // Request for main issues data, lets get max possible entries per page cause we dont have any pagination logic
    const { data } = await axiosWithAuth(`/${owner}/${repo}/issues?per_page=100&state=all`);

    const boardDataToSave = transformDataToBoard(data);

    // Transforming response and putting it to the store
    const issuesDataToSave = transformResponse(data);
    dispatch(setInitialData({ issues: issuesDataToSave, repo, owner }));

    // Preparing data for Board: items order and columns positions
    if (data.length) dispatch(setBoardData({ ...boardDataToSave, owner, repo }));
  });

  useEffect(() => {
    //@ts-ignore
    notify(error?.message);
  }, [error]);

  function inputSearchQuery(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchIssues();
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex style={{ marginBottom: "10px" }}>
        <Input
          placeholder="Enter repo URL here"
          style={InputStyles}
          onChange={inputSearchQuery}
          value={searchQuery}
        />
        <Button
          htmlType="reset"
          type="default"
          style={{ marginRight: "10px" }}
          onClick={handleReset}
          disabled={!searchQuery}
        >
          Clear
        </Button>
        <Button htmlType="submit" type="primary" loading={isLoading} disabled={!!!searchQuery}>
          Load issues
        </Button>
      </Flex>
    </form>
  );
};

export default Search;
