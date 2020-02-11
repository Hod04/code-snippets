import jsonPlaceholder from "../../apis/jsonPlaceholder";
import { Dispatch } from "react";

export const fetchPosts = () => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};
