import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  username: "",
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

    logout: () => {
      return initialState;
    },
    actionAddAdmin: (state) => {
      return { ...state, access: "admin" };
    },
    actionRemoveAdmin: (state) => {
      return { ...state, access: "user" };
    },
  },
});

export const { login, logout, actionAddAdmin, actionRemoveAdmin } =
  loginSlice.actions;

export const loginReducer = loginSlice.reducer;
