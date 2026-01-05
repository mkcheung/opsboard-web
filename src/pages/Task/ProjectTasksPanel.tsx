import { useEffect, useMemo, useRef, useState } from "react";
import type { Task } from "./taskTypes";
import { TaskDetailsDrawer } from "./TaskDetailsDrawer";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { } from "./taskTypes";
import { useAppDispatch } from "../../store/hooks/hooks";
import { taskActions } from "../../store/task/taskSlice";
import type {
    RequestTaskAddPayload,
    TaskFormProps,
    TaskStatus
} from "./taskTypes";
import {
    TaskPriorities,
} from "./taskTypes";
type Filter = "all" | "todo" | "doing" | "done";

type ProjectTasksPanelProps = {
    projectId: string | number;
    tasks: Task[];
    loading?: boolean;
    error?: string | null;
};


export function ProjectTasksPanel({
    projectId,
    tasks,
    loading = false,
    error = null,
}: ProjectTasksPanelProps) {
    const dispatch = useAppDispatch()
    const [filter, setFilter] = useState<Filter>("all");
    const [openMenuId, setOpenMenuId] = useState<Task["id"] | null>(null);
    const menuRootRef = useRef<HTMLDivElement | null>(null);

    const [formData, setFormData] = useState<TaskFormProps>({
        title: "",
        description: "",
        due_date: "",
        priority: 'low',
        status: 'todo',
        estimate_minutes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsMode, setDetailsMode] = useState<"view" | "edit">("view");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    useEffect(() => {
        const onDocMouseDown = (e: MouseEvent) => {
            if (!openMenuId) return;
            const target = e.target as Node;
            if (menuRootRef.current && !menuRootRef.current.contains(target)) setOpenMenuId(null);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenMenuId(null);
        };

        document.addEventListener("mousedown", onDocMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [openMenuId]);

    const filteredTasks = useMemo(() => {
        if (filter !== "all") return tasks.filter((t) => t.status === filter);
        return tasks;
    }, [tasks, filter]);

    const openDetails = (task: Task, mode: "view" | "edit") => {
        setOpenMenuId(null);
        setSelectedTask(task);
        setDetailsMode(mode);
        setDetailsOpen(true);
    };

    const openDelete = (task: Task) => {
        setOpenMenuId(null);
        setTaskToDelete(task);
        setDeleteOpen(true);
    };

    const convertValues = (formData: TaskFormProps): RequestTaskAddPayload => {
        return {
            ...formData,
            project_id: +projectId,
            status: 'todo' satisfies TaskStatus,
            estimate_minutes:
                formData.estimate_minutes?.trim() === "" ? null : Number(formData.estimate_minutes)
        }
    }

    const requestCreate = () => {

        const newTaskParams = convertValues({
            ...formData,
        });
        dispatch(taskActions.requestTaskAdd(newTaskParams));
        dispatch(taskActions.requestLoadProjectTasks({ project_id: +projectId }));
        setFormData({
            title: "",
            description: "",
            due_date: "",
            priority: 'low',
            status: 'todo',
            estimate_minutes: "",
        });
    };

    return (
        <div className="card">
            <div className="cardBody" style={{ display: "grid", gap: 14 }}>
                <div className="taskHeaderRow">
                    <div className="taskAddCard">
                        <div className="taskAddTop">
                            <input
                                name="title"
                                className="input"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Task title"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") requestCreate();
                                }}
                            />
                            <button className="btn btnPrimary" onClick={requestCreate}>
                                Add
                            </button>
                        </div>

                        {/* New fields: NO value/onChange per your request */}
                        <div className="taskAddGrid">
                            <div className="field" style={{ gridColumn: "1 / -1" }}>
                                <div className="label">Description</div>
                                <textarea
                                    name="description"
                                    className="input"
                                    value={formData.description}
                                    style={{ minHeight: 84, resize: "vertical" }}
                                    placeholder="Description of tasks"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <div className="label">Due date</div>
                                <input
                                    name="due_date"
                                    className="input"
                                    value={formData.due_date}
                                    type="date"
                                    placeholder="YYYY-MM-DD"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <div className="label">Estimate (minutes)</div>
                                <input
                                    name="estimate_minutes"
                                    className="input"
                                    value={formData.estimate_minutes}
                                    type="number"
                                    placeholder="e.g. 30"
                                    inputMode="numeric"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="field">
                                <div className="label">Priority</div>
                                <select className="input" name="priority" defaultValue={formData.priority} onChange={handleChange}>
                                    {
                                        TaskPriorities.map((priority) => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="taskRightControls">
                        <div className="taskFilters" role="tablist" aria-label="Task filters">
                            <button
                                type="button"
                                className={`chip ${filter === "all" ? "chipActive" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`chip ${filter === "todo" ? "chipActive" : ""}`}
                                onClick={() => setFilter("todo")}
                            >
                                ToDo
                            </button>
                            <button
                                type="button"
                                className={`chip ${filter === "doing" ? "chipActive" : ""}`}
                                onClick={() => setFilter("doing")}
                            >
                                Doing
                            </button>
                            <button
                                type="button"
                                className={`chip ${filter === "done" ? "chipActive" : ""}`}
                                onClick={() => setFilter("done")}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="taskError">
                        <div style={{ fontWeight: 900 }}>Couldn’t load tasks</div>
                        <div className="mutedText">{error}</div>
                    </div>
                ) : null}

                {/* TABLE */}
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 88 }}>Status</th>
                            <th>Title</th>
                            <th style={{ width: 160 }}>Due</th>
                            <th style={{ width: 120 }}>Priority</th>
                            <th style={{ width: 140 }}>Estimate</th>
                            <th style={{ width: 64 }} className="tableActionsTh">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="skeleton" style={{ width: 52, height: 12 }} />
                                    </td>
                                    <td>
                                        <div className="skeleton" style={{ width: "72%", height: 12 }} />
                                    </td>
                                    <td>
                                        <div className="skeleton" style={{ width: 90, height: 12 }} />
                                    </td>
                                    <td>
                                        <div className="skeleton" style={{ width: 70, height: 12 }} />
                                    </td>
                                    <td>
                                        <div className="skeleton" style={{ width: 90, height: 12 }} />
                                    </td>
                                    <td />
                                </tr>
                            ))
                        ) : filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className="taskEmpty">
                                        <div style={{ fontWeight: 900, marginBottom: 4 }}>No tasks</div>
                                        <div className="mutedText">Add your first task above.</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        <span className={`badge ${t.status === "done" ? "badgeDone" : "badgeOpen"}`}>
                                            {t.status === 'done' ? "Done" : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className={`taskTitleBtn ${t.status === "done" ? "taskTitleDone" : ""}`}
                                            onClick={() => openDetails(t, "view")}
                                            aria-label={`Open task ${t.title}`}
                                        >
                                            {t.title}
                                        </button>
                                        {t.description ? <div className="mutedText taskDesc">{t.description}</div> : null}
                                    </td>

                                    <td className="mutedText">{t.due_date ? t.due_date : "—"}</td>

                                    <td className="mutedText">{t.priority ? t.priority : "—"}</td>

                                    <td className="mutedText">
                                        {typeof t.estimate_minutes === "number" ? `${t.estimate_minutes} min` : "—"}
                                    </td>

                                    <td className="tableActionsTd">
                                        <div className="rowActionsRoot" ref={openMenuId === t.id ? menuRootRef : null}>
                                            <button
                                                type="button"
                                                className="kebabBtn"
                                                aria-haspopup="menu"
                                                aria-expanded={openMenuId === t.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId((prev) => (prev === t.id ? null : t.id));
                                                }}
                                            >
                                                ⋯
                                            </button>

                                            {openMenuId === t.id && (
                                                <div className="actionsMenu" role="menu" onClick={(e) => e.stopPropagation()}>
                                                    <button type="button" className="actionsMenuItem" role="menuitem" onClick={() => openDetails(t, "view")}>
                                                        View details
                                                    </button>

                                                    <button type="button" className="actionsMenuItem" role="menuitem" onClick={() => openDetails(t, "edit")}>
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="actionsMenuItem"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            const statusToSet = t.status !== 'done' ? "done" : "todo"
                                                            dispatch(taskActions.requestTaskUpdate({
                                                                ...t,
                                                                status: statusToSet
                                                            }));
                                                        }}
                                                    >
                                                        Mark as {t.status !== 'done' ? "Done" : "ToDo"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="actionsMenuItem actionsMenuItemDanger"
                                                        role="menuitem"
                                                        onClick={() => openDelete(t)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <TaskDetailsDrawer
                    open={detailsOpen}
                    task={selectedTask}
                    initialMode={detailsMode}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedTask(null);
                    }}
                />

                <DeleteTaskModal
                    open={deleteOpen}
                    task={taskToDelete}
                    onCancel={() => {
                        setDeleteOpen(false);
                        setTaskToDelete(null);
                    }}
                    onConfirmDelete={() => {
                        if (!taskToDelete) {
                            return;
                        }
                        dispatch(taskActions.requestTaskDelete(taskToDelete));
                        setDeleteOpen(false);
                        setTaskToDelete(null);
                    }}
                />
            </div>
        </div >
    );
}
