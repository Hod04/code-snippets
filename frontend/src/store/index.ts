import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import snippetListsReducer from "./snippetLists/reducers";

const rootReducer = combineReducers({
  snippetLists: snippetListsReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return store;
}
