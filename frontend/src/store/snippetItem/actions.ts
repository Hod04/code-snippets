import { Dispatch } from "react";
import backendAPI from "../../apis/backendAPI";

export const fetchSnippetItems = (listId: number) => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.get(`/snippets/${listId}/items`);
  dispatch({ type: "FETCH_SNIPPET_ITEMS", payload: response.data });
};
