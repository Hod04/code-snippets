import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import snippetListsReducer from "./snippetLists/reducers";
import snippetItemsReducer from "./snippetItem/reducers";
import menuReducer from "./Menu/reducers";

const rootReducer = combineReducers({
  snippetLists: snippetListsReducer,
  activeMenuItem: menuReducer,
  snippetItems: snippetItemsReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return store;
}
