import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collections: [],
};

export const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {},
});

export const collectionsReducer = collectionsSlice.reducer;
