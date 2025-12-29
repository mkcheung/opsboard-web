import {
    getToken,
} from "../../shared/auth/token"
import {
    useLocation,
    Navigate,
} from "react-router-dom";

type Props = {
    children: React.ReactNode;
}

const ProtectedRoute = ({
    children
}: Props) => {
    const token = getToken();
    const location = useLocation();
    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
}

export default ProtectedRoute;