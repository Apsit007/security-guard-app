import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import incidentsReducer from './slices/incidentsSlice';


export const store = configureStore({
    reducer: {
        app: appReducer,
        incidents: incidentsReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;