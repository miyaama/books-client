import { configureStore } from "@reduxjs/toolkit";

import { loginReducer, homeReducer } from "./slices";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    home: homeReducer
  },
});
