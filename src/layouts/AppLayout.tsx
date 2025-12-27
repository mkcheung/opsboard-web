import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function AppLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => {
            navigate('/login', { replace: true })
        }

        window.addEventListener('opsboard:unauthorized', handler)
        return () => window.removeEventListener('opsboard:unauthorized', handler)
    }, [navigate])

    return (
        <div style={{ padding: 16 }}>
            <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <strong>OpsBoard</strong>
                <nav style={{ display: "flex", gap: 10 }}>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            </header>

            <main style={{ marginTop: 16 }}>
                <Outlet />
            </main>
        </div>
    );
}