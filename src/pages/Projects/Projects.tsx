import {
    useEffect,
    useRef,
    useState
} from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { CreateEditProjectDrawer } from "./CreateEditProjectDrawer";
import type {
    Project
} from "./projectTypes";


const Projects = () => {
    const projects = useAppSelector((s) => s.project.projects);
    const [createEditOpen, setCreateEditOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const menuRootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocMouseDown = (e: MouseEvent) => {
            if (!openMenuId) return;
            const target = e.target as Node;
            if (menuRootRef.current && !menuRootRef.current.contains(target)) {
                setOpenMenuId(null);
            }
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

    const toggleMenu = (projectId: string) => {
        setOpenMenuId((prev) => (prev === projectId ? null : projectId));
    };

    const handleEdit = (projectId: string) => {
        setOpenMenuId(null);
        const selectedProject = projects.filter((project) => {
            return project.id == projectId;
        });
        console.log(selectedProject)
        setProjectToEdit(selectedProject[0])
        setCreateEditOpen(true);
    };

    const handleDelete = (projectId: string) => {
        setOpenMenuId(null);
        console.log("Delete project:", projectId);
    };

    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">Projects</h1>

                <div className="pageHeaderRight">
                    <button className="btn btnPrimary" onClick={() => setCreateEditOpen(true)}>
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
                                <th className="tableActionsTh" style={{ width: 64 }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                                    <td className="mutedText">{p.description}</td>

                                    <td className="tableActionsTd">
                                        <div className="rowActionsRoot" ref={openMenuId === p.id ? menuRootRef : null}>
                                            <button
                                                type="button"
                                                className="kebabBtn"
                                                aria-label={`Actions for ${p.name}`}
                                                aria-haspopup="menu"
                                                aria-expanded={openMenuId === p.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(p.id);
                                                }}
                                            >
                                                ⋯
                                            </button>

                                            {openMenuId === p.id && (
                                                <div className="actionsMenu" role="menu" onClick={(e) => e.stopPropagation()}>
                                                    <button type="button" className="actionsMenuItem" role="menuitem" onClick={() => handleEdit(p.id)}>
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="actionsMenuItem actionsMenuItemDanger"
                                                        role="menuitem"
                                                        onClick={() => handleDelete(p.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateEditProjectDrawer projectToEdit={projectToEdit} open={createEditOpen} onClose={() => setCreateEditOpen(false)} />
        </div>
    );
};

export default Projects;