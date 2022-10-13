import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { loginReducer } from "./slices";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});
