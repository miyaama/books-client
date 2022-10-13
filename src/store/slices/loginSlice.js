import { createSlice, current } from "@reduxjs/toolkit";

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
      console.log(current(state));
      state = action.payload;
    },

    logout: (state) => {
      state = initialState;
    },

    actionAddAdmin: (state) => {
      state = { ...state, access: "admin" };
    },
    actionRemoveAdmin: (state) => {
      state = { ...state, access: "user" };
    },
  },
});

export const { login, logout, actionAddAdmin, actionRemoveAdmin } =
  loginSlice.actions;

export const loginReducer = loginSlice.reducer;
