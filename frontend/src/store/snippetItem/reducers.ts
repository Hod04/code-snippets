import * as _ from "lodash";

const snippetItemsReducer = (
  state: { id: number }[] = [],
  action: { type: string; payload: { id: number } }
) => {
  switch (action.type) {
    case "FETCH_SNIPPET_ITEMS":
      return action.payload;
    case "CREATE_SNIPPET":
      return [...state, action.payload];
    case "CLEAR_SNIPPET_ITEMS_LIST":
      return [];
    case "UPDATE_SNIPPET":
      const updatedSnippet: { id: number } | undefined = _.find(
        state,
        (elem: { id: number }) =>
          action.payload && action.payload.id === elem.id
      );
      if (updatedSnippet != null) {
        let mutState = state;
        let toBeReplacedIndex = _.findIndex(
          mutState,
          snippet => snippet.id === updatedSnippet.id
        );
        mutState[toBeReplacedIndex] = { ...action.payload };
        return mutState;
      }
      return state;
    default:
      return state;
  }
};

export default snippetItemsReducer;
