// src/store/docSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface DocState {
  docId: string;
}

const initialState: DocState = {
  docId: "",
};

const docSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setDocId: (state, action) => {
      state.docId = action.payload;
    },
    clearDocId: (state) => {
      state.docId = "";
    },
  },
});

export const { setDocId, clearDocId } = docSlice.actions;
export default docSlice.reducer;
