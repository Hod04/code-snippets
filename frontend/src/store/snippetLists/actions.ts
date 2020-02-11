import { Dispatch } from "react";
import backendAPI from "../../apis/backendAPI";

export const fetchSnippetLists = () => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.get("/snippets");
  dispatch({ type: "FETCH_SNIPPETS", payload: response.data });
};
