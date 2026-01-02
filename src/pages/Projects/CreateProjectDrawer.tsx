import { Drawer } from "../../components/Drawer";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function CreateProjectDrawer({ open, onClose }: Props) {
    return (
        <Drawer open={open} onClose={onClose} title="New project">
            {/* Replace everything inside here with your form later */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ margin: 0, color: "#444" }}>
                    Put your create-project form here.
                </p>

                {/* Example placeholder fields (pure UI; no state/validation) */}
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>Project name</span>
                    <input
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
                        // no submit logic yet — you’ll implement later
                        onClick={() => { }}
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
