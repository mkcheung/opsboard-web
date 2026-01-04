import { useEffect, useRef } from "react";
import type { Project } from "./projectTypes";

type DeleteProjectModalProps = {
    open: boolean;
    project: Project | null;
    onCancel: () => void;
    onConfirm: () => void;
};

export function DeleteProjectModal({
    open,
    project,
    onCancel,
    onConfirm,
}: DeleteProjectModalProps) {
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
                aria-labelledby="deleteProjectTitle"
                aria-describedby="deleteProjectDesc"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="modalHeader">
                    <div className="modalIconDanger" aria-hidden="true">
                        !
                    </div>
                    <div>
                        <h2 id="deleteProjectTitle" className="h2" style={{ margin: 0 }}>
                            Delete project?
                        </h2>
                        <p id="deleteProjectDesc" className="mutedText" style={{ margin: "6px 0 0" }}>
                            This will permanently delete{" "}
                            <span style={{ fontWeight: 700 }}>{project?.name ?? "this project"}</span>.
                            This action can’t be undone.
                        </p>
                    </div>
                </div>

                <div className="modalActions">
                    <button ref={cancelBtnRef} className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btnDanger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}