import {
    useEffect,
    useState
} from "react";
import { uiActions } from "../../features/ui/uiSlice";
import { Drawer } from "../../components/Drawer";
import { http } from "../../shared/api/http";
import { useAppDispatch } from "../../store/hooks/hooks";
import type {
    CreateEditProjectDrawerProps,
    ProjectInput
} from "./projectTypes";
import { projectActions } from "../../store/project/projectSlice";

export function CreateEditProjectDrawer({ projectToEdit, open, onClose }: CreateEditProjectDrawerProps) {
    const isEdit = !!projectToEdit;
    const dispatch = useAppDispatch();
    const drawerTitle = !isEdit ? 'New project' : 'Update project';
    const [project, setProject] = useState<ProjectInput>({
        name: "",
        description: "",
    });
    useEffect(() => {
        setProject((prev) => ({
            ...prev,
            name: (projectToEdit?.name ?? ''),
            description: (projectToEdit?.description ?? ''),
        }));
    }, [projectToEdit])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProject((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        try {
            let res;
            if (!isEdit) {
                res = await http.post("/api/projects/", project);
            } else {
                res = await http.put(`/api/projects/${projectToEdit.id}/`, project);
            }

            if (res.status === 200 || res.status === 201) {
                dispatch(uiActions.toastAdded({ kind: "success", message: `Project ${!isEdit ? 'Added.' : 'Updated.'}.` }));
                dispatch(projectActions.requestProjectLoad())
                setProject({ name: "", description: "" });
                onClose();
            } else {
                dispatch(uiActions.toastAdded({ kind: "error", message: "Error in Project Submission" }));
            }
        } catch {
            dispatch(uiActions.toastAdded({ kind: "error", message: "Error in Project Submission" }));
        }
    };

    return (
        <Drawer open={open} onClose={onClose} title={drawerTitle}>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className="field">
                    <div className="label">Project name</div>
                    <input
                        className="input"
                        name="name"
                        onChange={handleChange}
                        value={project.name}
                        placeholder="e.g. OpsBoard v1"
                        autoFocus
                    />
                </div>

                <div className="field">
                    <div className="label">Description (optional)</div>
                    <textarea
                        className="input"
                        style={{ minHeight: 120, resize: "vertical" }}
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        placeholder="What is this project about?"
                    />
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="button" className="btn btnGhost" onClick={onClose}>
                        Cancel
                    </button>

                    <button type="button" className="btn btnPrimary" onClick={handleSubmit}>
                        {!isEdit ? "Create" : "Update"}
                    </button>
                </div>
            </form>
        </Drawer>
    );
}
