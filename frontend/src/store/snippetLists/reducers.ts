const snippetListsReducer = (
  state = [],
  action: { type: string; payload: {} }
) => {
  switch (action.type) {
    case "FETCH_SNIPPETS":
      return action.payload;
    default:
      return state;
  }
};

export default snippetListsReducer;
