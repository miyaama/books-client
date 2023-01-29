import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state) => {
      return { isDarkMode: !state.isDarkMode };
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
