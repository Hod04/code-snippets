const userReducer = (state = [], action: { type: string; payload: {} }) => {
  switch (action.type) {
    case "FETCH_USER":
      return [...state, action.payload];
    default:
      return state;
  }
};

export default userReducer;
