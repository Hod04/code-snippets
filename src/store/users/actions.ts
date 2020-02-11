import * as _ from "lodash";
import jsonPlaceholder from "../../apis/jsonPlaceholder";
import { Dispatch } from "react";

export const fetchUser = (id: number) => (
  dispatch: Dispatch<{ type: string; payload: {} }>
) => _fetchUser(id, dispatch);

const _fetchUser = _.memoize(
  async (id: number, dispatch: Dispatch<{ type: string; payload: {} }>) => {
    const response = await jsonPlaceholder.get(`/users/${id}`);
    dispatch({ type: "FETCH_USER", payload: response.data });
  }
);
