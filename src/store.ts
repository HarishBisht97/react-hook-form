import { configureStore } from "@reduxjs/toolkit";
import { user } from "./redux/registrationSlice.ts";

export const reduxStore = configureStore({
  reducer: { user: user },
});
