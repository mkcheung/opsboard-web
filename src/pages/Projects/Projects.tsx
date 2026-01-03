import {
    useEffect,
    useState
} from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { CreateProjectDrawer } from "./CreateProjectDrawer";

const Projects = () => {

    const projects = useAppSelector((s) => s.project.projects);
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div style={{ padding: 24 }}>
            <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ margin: 0 }}>Projects</h1>
                <div style={{ flex: 1 }} />
                <button
                    onClick={() => setCreateOpen(true)}
                    style={{
                        border: "1px solid #111",
                        background: "#111",
                        color: "#fff",
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                    }}
                >
                    New Project
                </button>
            </header>

            <table>
                <caption>My Projects</caption>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CreateProjectDrawer
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
        </div >
    );
}

export default Projects