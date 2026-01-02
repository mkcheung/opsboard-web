import {
    createSlice,
    nanoid,
} from "@reduxjs/toolkit";
import type {
    PayloadAction
} from "@reduxjs/toolkit";

export type ToastKind = 'success' | 'error' | 'info';

export type Toast = {
    id: string;
    kind: ToastKind;
    message: string;
    createdAt: number;
    duration: number | undefined;
};

type UiState = {
    toasts: Toast[];
};

type ToastPayload = {
    kind: ToastKind;
    message: string;
    createdAt?: number;
    duration?: number;
};

const initialState: UiState = {
    toasts: []
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toastAdded: {
            reducer(state, action: PayloadAction<Toast>) {
                state.toasts.push(action.payload);
            },
            prepare(payload: ToastPayload) {
                return {
                    payload: {
                        id: nanoid(),
                        kind: payload.kind,
                        message: payload.message,
                        createdAt: Date.now(),
                        duration: payload.duration
                    } satisfies Toast
                };
            },
        },
        toastRemoved(state, action: PayloadAction<{ id: string }>) {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload.id)
        },
        toastsCleared(state) {
            state.toasts = [];
        }
    }
});
export const uiActions = uiSlice.actions;
export default uiSlice.reducer;