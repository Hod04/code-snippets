import * as _ from "lodash";

const snippetItemsReducer = (
  state = [],
  action: { type: string; payload?: {} }
) => {
  switch (action.type) {
    case "FETCH_SNIPPET_ITEMS":
      return action.payload;
    default:
      return state;
  }
};

export default snippetItemsReducer;
