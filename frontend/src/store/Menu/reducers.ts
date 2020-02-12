const menuReducer = (
  state = "home",
  action: { type: string; item: string }
) => {
  switch (action.type) {
    case "TOGGLE_ITEM":
      return action.item;
    default:
      return state;
  }
};

export default menuReducer;
