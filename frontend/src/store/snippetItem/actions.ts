import { Dispatch } from "react";
import backendAPI from "../../apis/backendAPI";

export const fetchSnippetItems = (listId: number) => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.get(`/snippets/${listId}/items`);
  dispatch({ type: "FETCH_SNIPPET_ITEMS", payload: response.data });
};

export const createSnippet = (listId: number, title: string) => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.post(`/snippets/${listId}/items`, {
    title: title
  });
  dispatch({ type: "CREATE_SNIPPET", payload: response.data });
};

export const clearSnippetItemsList = () => (
  dispatch: Dispatch<{ type: string }>
) => dispatch({ type: "CLEAR_SNIPPET_ITEMS_LIST" });
