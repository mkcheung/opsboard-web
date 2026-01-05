import {
    createSlice
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
    RequestTaskAddPayload,
    Task,
    TaskState,
} from '../../pages/Task/taskTypes';

const initialState: TaskState = {
    tasks: []
}

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        requestTaskAdd(state, action: PayloadAction<RequestTaskAddPayload>) { },
        requestTaskUpdate(state, action: PayloadAction<Task>) { },
        requestTaskDelete(state, action: PayloadAction<Task>) { },
        requestLoadProjectTasks(state, action: PayloadAction<{ project_id: number }>) { },
        populateProjectTasks(state, action: PayloadAction<{ tasks: Task[] }>) {
            state.tasks = action.payload.tasks;
        }
    }
});
export const taskActions = taskSlice.actions;
export default taskSlice.reducer;