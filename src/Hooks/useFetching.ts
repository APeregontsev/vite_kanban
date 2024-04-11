import { useState } from "react";

export const useFetching = (
  callback: () => void
): { fetching: () => void; isLoading: boolean; error: unknown } => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>("");

  const fetching = async () => {
    try {
      setIsLoading(true);
      await callback();
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetching, isLoading, error };
};
