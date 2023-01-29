import { createSlice } from "@reduxjs/toolkit";
import { THEME } from "../../shared/constants";

const initialState = {
  isDarkMode: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state) => {
      localStorage.setItem(THEME, !state.isDarkMode);
      return { isDarkMode: !state.isDarkMode };
    },
    setTheme: (_, action) => {
      console.log("action.payload", action.payload);
      localStorage.setItem(THEME, action.payload);
      return { isDarkMode: action.payload };
    },
  },
});

export const { changeTheme, setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
