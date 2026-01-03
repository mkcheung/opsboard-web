import { useState } from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { CreateProjectDrawer } from "./CreateProjectDrawer";

const Projects = () => {
    const projects = useAppSelector((s) => s.project.projects);
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">Projects</h1>

                <div className="pageHeaderRight">
                    <button className="btn btnPrimary" onClick={() => setCreateOpen(true)}>
                        New Project
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="cardBody">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: "30%" }}>Project Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                                    <td className="mutedText">{p.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateProjectDrawer open={createOpen} onClose={() => setCreateOpen(false)} />
        </div>
    );
};

export default Projects;