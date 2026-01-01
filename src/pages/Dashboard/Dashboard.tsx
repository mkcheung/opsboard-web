import {
    useNavigate
} from "react-router-dom";
import {
    useAppDispatch,
} from "../../store/hooks/hooks";
import { authActions } from "../../store/auth/authSlice";

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        dispatch(authActions.logoutRequested());
        navigate('/login');
    }
    return <div>
        <h1>
            Dashboard
        </h1>
        <button onClick={() => handleLogout()}>
            Logout
        </button>
    </div>
}

export default Dashboard