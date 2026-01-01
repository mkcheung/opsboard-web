import {
    Navigate,
    Outlet,
} from "react-router-dom";
import {
    useAppSelector
} from "../../store/hooks/hooks";

const ProtectedRoute = () => {

    const status = useAppSelector((s) => s.auth.status);

    if (status === 'checking') {
        return <div>...Loading</div>
    }
    if (status === 'unauthenticated') {
        return <Navigate to="/login" replace />;
    }

    return <>
        <Outlet />
    </>;
}

export default ProtectedRoute;