import { useEffect, useRef } from "react";
import type { Task } from "./taskTypes";

type DeleteTaskModalProps = {
    open: boolean;
    task: Task | null;
    onCancel: () => void;

    /** UI-only intent (you implement business logic) */
    onConfirmDelete: (task: Task) => void;
};

export function DeleteTaskModal({ open, task, onCancel, onConfirmDelete }: DeleteTaskModalProps) {
    const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!open) return;
        cancelBtnRef.current?.focus();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="modalBackdrop" onMouseDown={onCancel} role="presentation">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="deleteTaskTitle"
                aria-describedby="deleteTaskDesc"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <div className="modalIconDanger" aria-hidden="true">
                        !
                    </div>
                    <div>
                        <h2 id="deleteTaskTitle" className="h2" style={{ margin: 0 }}>
                            Delete task?
                        </h2>
                        <p id="deleteTaskDesc" className="mutedText" style={{ margin: "6px 0 0" }}>
                            This will permanently delete{" "}
                            <span style={{ fontWeight: 800 }}>{task?.title ?? "this task"}</span>. This action can’t be undone.
                        </p>
                    </div>
                </div>

                <div className="modalActions">
                    <button ref={cancelBtnRef} className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        className="btn btnDanger"
                        onClick={() => {
                            if (!task) return;
                            onConfirmDelete(task);
                        }}
                        disabled={!task}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
