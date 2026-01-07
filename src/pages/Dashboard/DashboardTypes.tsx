
import type {
    TaskId,
    TaskPriority,
    TaskStatus
} from "../Task/taskTypes";

export type TimeWindow = "today" | "7d" | "30d";

export type TileKey = "overdue" | "due_today" | "due_7d" | "due_30d" | "open_tasks" | "done_week";

export type Tile = {
    key: TileKey;
    label: string;
    value: number;
    tone?: "danger" | "warn" | "info" | "success" | "neutral";
};

export type NextAction = {
    id: number | string;
    title: string;
    projectId: number | string;
    projectName: string;
    dueLabel?: string;
    due_date?: string;
    priority: string;
};

export type ProjectAttention = {
    id: number | string;
    name: string;
    overdue: number;
    dueSoon: number;
    open: number;
    progressPct?: number;
};

export type UpcomingDay = {
    id: string;
    label: string;
    dueCount: number;
};

export type SortableTask = {
    due_date?: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    updated_at?: string | null;
    created_at?: string | null;
};

export type DayOptions = {
    weekday: string;
}

export type MonthOptions = {
    month: string;
}

export const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
export const STATUS_RANK: Record<TaskStatus, number> = { doing: 0, todo: 1, done: 2 };