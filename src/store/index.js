import { configureStore } from "@reduxjs/toolkit";

import { loginReducer, homeReducer, collectionsReducer } from "./slices";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    home: homeReducer,
    collections: collectionsReducer
  },
});
