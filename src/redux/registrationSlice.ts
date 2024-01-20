import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    addUserDetails: (state, action) => {
      state.users = [...state.users, action.payload] as any;
    },
    resetRegistration: (state) => {
      state.users = initialState.users;
    },
  },
});

export const { addUserDetails, resetRegistration } = registrationSlice.actions;

export const user = registrationSlice.reducer;
