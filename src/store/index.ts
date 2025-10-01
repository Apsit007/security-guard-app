// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        auth: authReducer, // ✅ เพิ่มตรงนี้
    },
});

// สร้าง type ช่วย
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
