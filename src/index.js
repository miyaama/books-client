import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeSelector } from "./components/Theme/Theme";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeSelector>
          <App />
        </ThemeSelector>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
