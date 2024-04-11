import { FC, useEffect, useState } from "react";
import { StarFilled } from "@ant-design/icons";
import { formatCount } from "./helper";
import { useAppSelector } from "src/store/store";
import { notify } from "../Search/helper";
import { axiosWithAuth } from "src/api/api";
import { useFetching } from "src/Hooks/useFetching";

const StarsCounter: FC = ({}) => {
  const { owner, repo } = useAppSelector((state) => state.issues);
  const [stars, setStars] = useState<number>(0);

  // Loading data from the API
  const { fetching: fetchStars, error } = useFetching(async () => {
    if (!owner || !repo) return;

    // Request for stars_count
    const {
      data: { stargazers_count },
    } = await axiosWithAuth(`/${owner}/${repo}`);

    if (stargazers_count) setStars(stargazers_count);
  });

  useEffect(() => {
    if (!owner || !repo) return;
    fetchStars();
  }, [owner, repo]);

  useEffect(() => {
    if (!error) return;
    //@ts-ignore
    notify(error?.message);
  }, [error]);

  return (
    <>
      <StarFilled style={{ color: "orange" }} /> {formatCount(stars)} stars
    </>
  );
};

export default StarsCounter;
