import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  name: "",
  id: "",
  email: "",
  access: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },

    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout, actionAddAdmin, actionRemoveAdmin } =
  loginSlice.actions;

export const loginReducer = loginSlice.reducer;
