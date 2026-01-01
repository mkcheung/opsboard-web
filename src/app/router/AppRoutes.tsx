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
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}