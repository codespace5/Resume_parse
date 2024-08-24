import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
}

const initialState: IinitialState = {
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {

    }
})

export const {
} = appSlice.actions;

export default appSlice.reducer;