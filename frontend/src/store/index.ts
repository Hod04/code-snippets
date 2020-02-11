import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import userReducer from "./users/reducers";
import postsReducer from "./posts/reducers";

const rootReducer = combineReducers({
  users: userReducer,
  posts: postsReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(thunk));
  return store;
}
