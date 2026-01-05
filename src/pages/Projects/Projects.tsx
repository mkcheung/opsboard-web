import {
    useEffect,
    useRef,
    useState
} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { CreateEditProjectDrawer } from "./CreateEditProjectDrawer";
import type {
    Project
} from "./projectTypes";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { projectActions } from "../../store/project/projectSlice";
import { Link, useNavigate } from "react-router-dom";

const Projects = () => {
    const dispatch = useAppDispatch();
    const projects = useAppSelector((s) => s.project.projects);
    const [createEditOpen, setCreateEditOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const menuRootRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

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

    const toggleMenu = (projectId: string | number) => {
        setOpenMenuId((prev) => (prev === projectId ? null : projectId));
    };

    const handleEdit = (projectId: string | number) => {
        setOpenMenuId(null);
        const selectedProject = projects.filter((project) => {
            return project.id == projectId;
        });
        setProjectToEdit(selectedProject[0])
        setCreateEditOpen(true);
    };

    const handleDelete = (projectId: string | number) => {
        setOpenMenuId(null);
        const selected = projects.find((p) => p.id === projectId) ?? null;
        setProjectToDelete(selected);
        setDeleteOpen(true);
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
                                    <td style={{ fontWeight: 700 }}>
                                        <Link className="rowLink" to={`/projects/${p.id}`}>
                                            {p.name}
                                        </Link>
                                    </td>
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
                                                    <button
                                                        type="button"
                                                        className="actionsMenuItem"
                                                        role="menuitem"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            navigate(`/projects/${p.id}`);
                                                        }}
                                                    >
                                                        Tasks
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
            <DeleteProjectModal
                open={deleteOpen}
                project={projectToDelete}
                onCancel={() => {
                    setDeleteOpen(false);
                    setProjectToDelete(null);
                }}
                onConfirm={() => {
                    if (!projectToDelete) return;

                    dispatch(projectActions.requestDeleteProject({ project: projectToDelete }));

                    setDeleteOpen(false);
                    setProjectToDelete(null);
                }}
            />
        </div>
    );
};

export default Projects;