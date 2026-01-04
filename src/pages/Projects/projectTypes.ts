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
    id: string | number;
    user_id: string;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
};

export interface ProjectState {
    projects: Project[]
};
