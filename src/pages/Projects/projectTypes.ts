import type { Task } from "../Task/taskTypes";
export type CreateEditProjectDrawerProps = {
    projectToEdit: Project | null
    open: boolean;
    onClose: () => void;
};

export type ProjectInput = {
    id?: string | number;
    user_id?: string;
    name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
};

export interface Project {
    id: number;
    user_id: number;
    name: string;
    task: Task[];
    description: string;
    created_at?: string;
    updated_at?: string;
};

export interface ProjectState {
    projects: Project[]
};

export type NextTask = {
    id: number;
    projectId: string | number;
    projectName: string;
    title: string;
    dueLabel?: string;
    due_date?: string;
    priority: string;
};