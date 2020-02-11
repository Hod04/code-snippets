import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";

import App from "./App";

const mountNode = document.getElementById("app");
ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  mountNode
);
