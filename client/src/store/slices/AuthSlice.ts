import { createSlice } from "@reduxjs/toolkit";
import { ACCESS_TOKEN } from "@/constants";

interface IinitialState {
    token: string | null,
}

const initialState: IinitialState = {
    token: localStorage.getItem(ACCESS_TOKEN) || null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SignIn: (state, action) => {
            state.token = action.payload;
            localStorage.setItem(ACCESS_TOKEN, action.payload);
        },
        SignOut: (state) => {
            state.token = null;
            localStorage.removeItem(ACCESS_TOKEN);
        }
    }
})

export const {
    SignIn,
    SignOut
} = authSlice.actions;

export default authSlice.reducer;