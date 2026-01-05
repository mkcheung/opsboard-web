export type TaskId = string | number | null;
export type TaskPriority = "low" | "medium" | "high";
export const TaskPriorities = ["low", "medium", "high"] as const satisfies readonly TaskPriority[];

export type Task = {
    id: TaskId;
    project_id: string | number;
    title: string;
    status: TaskStatus;
    description?: string | null;
    due_date?: string | null;
    priority?: TaskPriority | null;
    estimate_minutes?: string | number | null;
    updatedAt?: string | null;
};

export type TaskCreateInput = {
    title: string;
    description?: string | null;
    due_date?: string | null;
    priority?: TaskPriority | null;
    estimateMinutes?: number | null;
};

export type TaskUpdateInput = {
    title?: string;
    description?: string | null;
    due_date?: string | null;
    priority?: TaskPriority | null;
    estimateMinutes?: number | null;
    isDone?: boolean;
};

export interface TaskState {
    tasks: Task[]
};

export type TaskFormProps = {
    title: string,
    description: string,
    due_date?: string,
    priority?: TaskPriority | undefined;
    status: TaskStatus;
    estimate_minutes?: string | number | undefined;
};

export type RequestTaskAddPayload = {
    project_id: string | number;
    title: string;
    status: TaskStatus;
    description?: string | null;
    due_date?: string | null;
    priority?: TaskPriority | undefined;
    estimate_minutes?: number | null;
};
export type TaskStatus = 'todo' | 'doing' | 'done';

export const TaskStatuses = ['todo', 'doing', 'done'] as const satisfies readonly TaskStatus[];