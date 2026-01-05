import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ProjectTasksPanel } from "../Task/ProjectTasksPanel";
import type { Task } from "../Task/taskTypes";
import {
    useAppDispatch,
    useAppSelector
} from "../../store/hooks/hooks";
import { taskActions } from "../../store/task/taskSlice";

// later: replace with your selector
// let tasks: Task[]; =[]
const fakeTasks: Task[] = [];
let tasks: Task[] = [];

export default function ProjectDetail() {
    const dispatch = useAppDispatch();
    const { projectId } = useParams();
    const selectedProject = useAppSelector((s) => s.project.projects.find((project) => project.id == projectId));
    tasks = useAppSelector((s) => s.task.tasks);

    useEffect(() => {
        dispatch(taskActions.requestLoadProjectTasks({ project_id: +projectId }));
    }, [dispatch, projectId])

    if (selectedProject) {
        return (
            <div>
                <div className="pageHeader">
                    <div>
                        <div className="mutedText" style={{ marginBottom: 6 }}>
                            <Link to="/projects" className="rowLink">Projects</Link> <span aria-hidden="true">→</span> {selectedProject.name}
                        </div>
                        <h1 className="h1" style={{ fontSize: 34, margin: 0 }}>
                            Tasks
                        </h1>
                    </div>
                </div>

                <ProjectTasksPanel
                    projectId={projectId ?? ""}
                    tasks={tasks}
                    loading={false}
                    error={null}
                />
            </div>
        );
    }
}
