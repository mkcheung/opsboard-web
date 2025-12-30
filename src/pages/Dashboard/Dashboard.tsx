import { useNavigate } from "react-router-dom";
import { clearToken } from "../../shared/auth/token";
import { http } from "../../shared/api/http";
import {
    getApiBaseUrl
} from "../../shared/config/backend";
import {
    useAppDispatch,
    useAppSelector,
} from "../../store/hooks/hooks";
import { authActions } from "../../store/auth/authSlice";

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.auth.status);
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
        <h1>
            Dashboard
        </h1>
        <button onClick={() => handleLogout()}>
            Logout
        </button>
        <div>
            {status}
        </div>
        <button onClick={() => dispatch(authActions.bootRequested())}>
            Boot Requested
        </button>
        <button onClick={() => dispatch(authActions.bootSucceeded({
            user: { id: 1, name: 'Test', email: "test@test.com" },
            token: 'yaddayadda'
        }))}>
            Boot Succeeded
        </button>
    </div>
}

export default Dashboard