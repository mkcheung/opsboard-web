import {
    useEffect,
    useState
} from "react";
import { CreateProjectDrawer } from "./CreateProjectDrawer";
import { http } from "../../shared/api/http";
import { getApiBaseUrl } from "../../shared/config/backend";

interface ProjectType {
    id: string
    name: string
    description: string
}

const Projects = () => {

    const [createOpen, setCreateOpen] = useState(false);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        let projectData = await http.get(`${getApiBaseUrl}/api/projects`).then(res => res.data);
        setProjects(projectData);
    }
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

            {/* Your list/table/grid goes here */}

            <CreateProjectDrawer
                open={createOpen}
                onClose={() => setCreateOpen(false)}
            />
        </div>
    );
}

export default Projects