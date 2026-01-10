import {
    createSlice
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated' | 'error' | "loading";

export interface User {
    id: number | string;
    name: string;
    email: string;
};

export interface AuthState {
    status: AuthStatus;
    user: User | null;
    token: string | null;
    error: string | null;
};

const initialState: AuthState = {
    status: 'checking',
    user: null,
    token: null,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        bootRequested(state) {
            state.status = 'checking';
            state.error = null;
        },
        bootSucceeded(state, action: PayloadAction<{ user: User, token: string | null }>) {
            state.status = 'authenticated';
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        bootFailed(state) {
            state.status = 'unauthenticated';
            state.user = null;
            state.token = null;
            state.error = null;
        },
        loginRequested(state, _action: PayloadAction<{ email: string; password: string }>) {
            state.status = 'checking';
            state.error = null;
        },
        loginSucceeded(state, action: PayloadAction<{ user: User; token: string }>) {
            state.status = 'authenticated';
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;

        },
        loginFailed(state, action: PayloadAction<{ error: string }>) {
            state.status = 'unauthenticated';
            state.user = null;
            state.token = null;
            state.error = action.payload.error;
        },
        logoutRequested(state) {
            state.status = 'checking',
                state.error = null;
        },
        logoutSucceeded(state) {
            state.status = 'unauthenticated',
                state.error = null;
            state.user = null;
            state.token = null;
        }
    }
});
export const authActions = authSlice.actions; // use actions for dispatch
export default authSlice.reducer; // attach to store