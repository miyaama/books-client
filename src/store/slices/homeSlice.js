import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";

import { BACKEND_URL } from "../../shared/constants";

const initialState = {
  collections: [],
  items: [],
  tags: [],
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // addCollections: (state, action) => {
    //   state.collections = action.payload;
    // },
    addItem: (state, action) => {
      state.items = [action.payload, ...state.items.slice(0, 5)];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, { payload }) => {
      state.tags = payload;
    });
    builder.addCase(fetchCollections.fulfilled, (state, { payload }) => {
      state.collections = payload;
    });
    builder.addCase(fetchItems.fulfilled, (state, { payload }) => {
      state.items = payload;
    });
  },
});

export const fetchTags = createAsyncThunk("tags/fetch", async () => {
  const tags = await axios.get(`${BACKEND_URL}/tags`);
  return tags.data;
});

export const fetchCollections = createAsyncThunk(
  "collections/fetch",
  async () => {
    const collections = await axios.get(`${BACKEND_URL}/collections/largest`);
    return collections.data;
  }
);

export const fetchItems = createAsyncThunk("items/fetch", async () => {
  const items = await axios.get(`${BACKEND_URL}/items/lastitems`);
  return items.data;
});

export const { addCollections, addItem } = homeSlice.actions;

export const homeReducer = homeSlice.reducer;
