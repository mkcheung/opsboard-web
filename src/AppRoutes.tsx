import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import AppLayout from './layouts/AppLayout';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Settings from './Settings';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    )
}