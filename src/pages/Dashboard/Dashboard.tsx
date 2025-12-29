import { useNavigate } from "react-router-dom";
import { clearToken } from "../../shared/auth/token";
import { http } from "../../shared/api/http";
import {
    getApiBaseUrl
} from "../../shared/config/backend";

const Dashboard = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await http.post(`${getApiBaseUrl()}/api/auth/logout`)
        } catch (err) {
            console.error('Logout failed: ', err);
        } finally {
            clearToken();
            navigate('/login');
        }
    }
    return <div>
        Dashboard
        <button onClick={() => handleLogout()}>
            Logout
        </button>
    </div>
}

export default Dashboard