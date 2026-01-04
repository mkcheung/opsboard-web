import {
    createSlice
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../auth/authSlice';
import type {
    Project,
    ProjectState
} from '../../pages/Projects/projectTypes';

const initialState: ProjectState = {
    projects: []
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        requestProjectLoad(state) { },
        loadProjects(state, action: PayloadAction<{ projects: Project[] }>) {
            state.projects = action.payload.projects;
        }
    }
});
export const projectActions = projectSlice.actions;
export default projectSlice.reducer;


