// src/store/hook.ts
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // ✅ type-only import
import type { RootState, AppDispatch } from "./index";

// ใช้แทน useDispatch() → type-safe
export const useAppDispatch: () => AppDispatch = useDispatch;

// ใช้แทน useSelector() → type-safe
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
