import * as _ from "lodash";

const snippetItemsReducer = (
  state = [],
  action: { type: string; payload?: {} }
) => {
  switch (action.type) {
    case "FETCH_SNIPPET_ITEMS":
      return action.payload;
    case "CREATE_SNIPPET":
      return [...state, action.payload];
    case "CLEAR_SNIPPET_ITEMS_LIST":
      return [];
    default:
      return state;
  }
};

export default snippetItemsReducer;
