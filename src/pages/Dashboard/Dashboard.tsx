import { useNavigate } from "react-router-dom";
import { clearToken } from "../../shared/auth/token";
import { http } from "../../shared/api/http";
import {
    getApiBaseUrl
} from "../../shared/config/backend";

const Dashboard = () => {
    const navigate = useNavigate();
    const handleLogout = (e) => {
        const response = http.post(`${getApiBaseUrl()}/api/auth/logout`)
        clearToken();
        navigate('/login');
    }
    return <div>
        Dashboard
        <button onClick={() => handleLogout}>
            Logout
        </button>
    </div>
}

export default Dashboard