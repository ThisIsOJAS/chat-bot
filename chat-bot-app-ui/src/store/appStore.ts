import { configureStore } from "@reduxjs/toolkit";
import docReducer from "./docSlice";

export const store = configureStore({
  reducer: {
    document: docReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
