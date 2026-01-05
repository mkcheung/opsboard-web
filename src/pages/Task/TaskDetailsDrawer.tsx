import { useEffect, useMemo, useState } from "react";
import { Drawer } from "../../components/Drawer";
import type { Task } from "./taskTypes";
import {
    useAppDispatch,
} from "../../store/hooks/hooks";
import { taskActions } from "../../store/task/taskSlice";
import {
    TaskPriorities,
    TaskStatuses
} from "./taskTypes";
import type {
    TaskFormProps,
    TaskPriority,
    TaskStatus
} from "./taskTypes";

type TaskDetailsDrawerProps = {
    open: boolean;
    task: Task | null;
    initialMode: "view" | "edit";
    onClose: () => void;
};

export function TaskDetailsDrawer({
    open,
    task,
    initialMode,
    onClose,
}: TaskDetailsDrawerProps) {
    const dispatch = useAppDispatch()
    const [mode, setMode] = useState<"view" | "edit">(initialMode);

    const initial = useMemo<TaskFormProps>(
        () => ({
            title: task?.title ?? "",
            description: task?.description ?? "",
            due_date: task?.due_date ?? "",
            estimate_minutes: task?.estimate_minutes ?? undefined,
            status: task?.status ?? "todo",
            priority: task?.priority ?? undefined,
        }),
        [task]
    );

    // UI-only local form state (does NOT update task list)
    const [title, setTitle] = useState(initial.title);
    const [description, setDescription] = useState(initial.description);
    const [due_date, setDueDate] = useState(initial.due_date);
    const [status, setStatus] = useState<TaskStatus>(initial.status);
    const [priority, setPriority] = useState<TaskPriority | undefined>(initial.priority);
    const [estimate_minutes, setEstimateMinutes] = useState<string | number | undefined>(initial.estimate_minutes);

    useEffect(() => setMode(initialMode), [initialMode]);
    useEffect(() => {
        setTitle(initial.title);
        setDescription(initial.description);
        setDueDate(initial.due_date);
        setStatus(status);
        setPriority(initial.priority);
        setEstimateMinutes(initial.estimate_minutes);
    }, [initial]);

    const handleSave = () => {
        if (!task) return;

        dispatch(taskActions.requestTaskUpdate({
            ...task,
            title,
            description,
            due_date,
            status,
            priority,
            estimate_minutes
        }));

        setMode("view");
    };

    return (
        <Drawer open={open} onClose={onClose} title="Task details">
            {!task ? (
                <div className="mutedText">No task selected.</div>
            ) : (
                <div style={{ display: "grid", gap: 14 }}>
                    <div className="taskMetaRow">
                        <span className={`badge ${task.status === "done" ? "badgeDone" : "badgeOpen"}`}>
                            {task.status === 'done' ? "Done" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        {task.updatedAt ? <span className="mutedText">Updated: {task.updatedAt}</span> : null}
                    </div>

                    <div className="field">
                        <div className="label">Title</div>
                        <input
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={mode !== "edit"}
                            placeholder="Task title"
                            autoFocus
                        />
                    </div>

                    <div className="field">
                        <div className="label">Description</div>
                        <textarea
                            className="input"
                            style={{ minHeight: 140, resize: "vertical" }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={mode !== "edit"}
                            placeholder="Notes / details…"
                        />
                    </div>

                    <div className="field">
                        <div className="label">Due date</div>
                        <input
                            type="date"
                            className="input"
                            value={due_date}
                            onChange={(e) => setDueDate(e.target.value)}
                            disabled={mode !== "edit"}
                            placeholder="YYYY-MM-DD"
                        />
                    </div>

                    <div className="field">
                        <div className="label">Estimate (minutes)</div>
                        <input
                            name="estimate_minutes"
                            className="input"
                            value={estimate_minutes}
                            type="number"
                            placeholder="e.g. 30"
                            inputMode="numeric"
                            onChange={(e) => setEstimateMinutes(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <div className="label">Priority</div>
                        <select className="input" name="priority" value={priority ?? ""} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                            {
                                TaskPriorities.map((taskpriority) => (
                                    <option key={taskpriority} value={taskpriority}>{taskpriority}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="field">
                        <div className="label">Status</div>
                        <select className="input" name="status" value={status ?? ""} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                            {
                                TaskStatuses.map((taskstatus) => (
                                    <option key={taskstatus} value={taskstatus}>{taskstatus}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                        <button type="button" className="btn btnGhost" onClick={onClose}>
                            Close
                        </button>

                        {mode === "view" ? (
                            <button type="button" className="btn btnPrimary" onClick={() => setMode("edit")}>
                                Edit
                            </button>
                        ) : (
                            <button type="button" className="btn btnPrimary" onClick={handleSave}>
                                Save
                            </button>
                        )}
                    </div>
                </div>
            )
            }
        </Drawer >
    );
}
