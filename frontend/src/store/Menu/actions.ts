import { Dispatch } from "react";

export const toggleMenuItem = (item: string) => (
  dispatch: Dispatch<{ type: string; item: string }>
) => {
  dispatch({ type: "TOGGLE_ITEM", item });
};
