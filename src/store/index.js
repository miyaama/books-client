import { configureStore } from "@reduxjs/toolkit";

import { loginReducer, homeReducer, themeReducer } from "./slices";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    home: homeReducer,
    theme: themeReducer
  },
});
