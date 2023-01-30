import { createSlice } from "@reduxjs/toolkit";
import { DARK_THEME, LIGHT_THEME, THEME } from "../../shared/constants";

const initialState = {
  isDarkMode: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state) => {
      let changedTheme;
      changedTheme = state.isDarkMode === DARK_THEME ? LIGHT_THEME : DARK_THEME;
      localStorage.setItem(THEME, changedTheme);
      return { isDarkMode: changedTheme };
    },
    setTheme: (_, action) => {
      localStorage.setItem(THEME, action.payload);
      return { isDarkMode: action.payload };
    },
  },
});

export const { changeTheme, setTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
