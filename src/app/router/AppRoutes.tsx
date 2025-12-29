import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import AppLayout from '../../layouts/AppLayout';
import Dashboard from "../../pages/Dashboard/Dashboard";
import Home from '../../pages/Home/Home';
import Login from '../../pages/Login/Login';
import ProtectedRoute from "./ProtectedRoute";
import Register from '../../pages/Register/Register';
import Settings from "../../pages/Settings/Settings";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}