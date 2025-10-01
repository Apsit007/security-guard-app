import { createSlice } from '@reduxjs/toolkit';


type AppState = {
    drawerOpen: boolean;
};


const initialState: AppState = { drawerOpen: true };


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleDrawer(state) { state.drawerOpen = !state.drawerOpen; },
        setDrawer(state, action) { state.drawerOpen = action.payload as boolean; },
    },
});


export const { toggleDrawer, setDrawer } = appSlice.actions;
export default appSlice.reducer;