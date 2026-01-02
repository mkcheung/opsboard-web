import {
    useNavigate
} from "react-router-dom";
import {
    useAppDispatch,
} from "../../store/hooks/hooks";
import {
    useEffect,
    useState
} from "react";
import {
    authActions
} from "../../store/auth/authSlice";
import { http } from "../../shared/api/http";
import { getApiBaseUrl } from "../../shared/config/backend";

interface ProjectType {
    id: string
    name: string
    description: string
}

const Dashboard = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        let projectData = await http.get(`${getApiBaseUrl}/api/projects`).then(res => res.data);
        setProjects(projectData);
    }

    const handleLogout = async () => {
        dispatch(authActions.logoutRequested());
        navigate('/login');
    }
    return <div>
        <h1>
            Dashboard
        </h1>
        <div>
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
                            <td>
                                {project.name}
                            </td>
                            <td>
                                {project.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button onClick={() => handleLogout()}>
            Logout
        </button>
    </div>
}

export default Dashboard