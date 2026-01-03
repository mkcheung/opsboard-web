import {
    useState
} from "react";
import { uiActions } from "../../features/ui/uiSlice";
import { Drawer } from "../../components/Drawer";
import { http } from "../../shared/api/http";
import { useAppDispatch } from "../../store/hooks/hooks";

type Props = {
    open: boolean;
    onClose: () => void;
};

type projectInputProps = {
    name: string;
    description: string;
}

export function CreateProjectDrawer({ open, onClose }: Props) {
    const dispatch = useAppDispatch();
    const [project, setProject] = useState<projectInputProps>({
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProject((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        try {
            const registerResponse = await http.post('/api/projects', project);
            if (registerResponse.status === 200) {
                dispatch(uiActions.toastAdded({ kind: 'success', message: 'Project Added.' }))
                setProject({
                    name: '',
                    description: ''
                });
            } else {
                console.error(`Error in Project Submission`);
                dispatch(uiActions.toastAdded({ kind: 'error', message: 'Error in Project Submission' }))
            }
        } catch (err) {
            dispatch(uiActions.toastAdded({ kind: 'error', message: 'Error in Project Submission' }))
        } finally {
            onClose();
        }
    };

    return (
        <Drawer open={open} onClose={onClose} title="New project">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, color: "#444" }}>
                    Put your create-project form here.
                </p>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>Project name</span>
                    <input
                        name="name"
                        onChange={(e) => handleChange(e)}
                        value={project.name}
                        placeholder="e.g. OpsBoard v1"
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            outline: "none",
                        }}
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>Description (optional)</span>
                    <textarea
                        rows={5}
                        name='description'
                        value={project.description}
                        onChange={(e) => handleChange(e)}
                        placeholder="What is this project about?"
                        style={{
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            outline: "none",
                            resize: "vertical",
                        }}
                    />
                </label>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: "1px solid #ddd",
                            background: "#fff",
                            borderRadius: 10,
                            padding: "10px 12px",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e)}
                        style={{
                            border: "1px solid #111",
                            background: "#111",
                            color: "#fff",
                            borderRadius: 10,
                            padding: "10px 12px",
                            cursor: "pointer",
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
