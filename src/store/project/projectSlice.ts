import {
    createSlice
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../auth/authSlice';

export interface Project {
    id: string | number;
    user_id: string;
    name: string;
    description: string;
};

interface ProjectState {
    projects: Project[]
};

const initialState: ProjectState = {
    projects: []
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        requestProjectLoad(state, action: PayloadAction<{ user: User }>) { },
        loadProjects(state, action: PayloadAction<{ projects: Project[] }>) {
            state.projects = action.payload.projects;
        }
    }
});
export const projectActions = projectSlice.actions;
export default projectSlice.reducer;


