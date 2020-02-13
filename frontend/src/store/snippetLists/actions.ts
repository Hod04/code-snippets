import { Dispatch } from "react";
import backendAPI from "../../apis/backendAPI";

export const fetchSnippetLists = () => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.get("/snippets");
  dispatch({ type: "FETCH_SNIPPET_LISTS", payload: response.data });
};

export const createSnippetList = (title: string) => async (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => {
  const response = await backendAPI.post("/snippets/", { title: title });
  dispatch({ type: "CREATE_SNIPPET_LIST", payload: response.data });
};

export const deleteSnippetList = (id: number) => async (
  dispatch: Dispatch<{ type: string; id: number }>
) => {
  await backendAPI.delete(`/snippets/${id}`);
  dispatch({ type: "DELETE_SNIPPET_LIST", id });
};
