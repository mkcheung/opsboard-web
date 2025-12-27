import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div style={{ padding: 16 }}>
            <header style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <strong>OpsBoard</strong>
                <nav style={{ display: "flex", gap: 10 }}>
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/settings">Settings</Link>
                </nav>
            </header>

            <main style={{ marginTop: 16 }}>
                <Outlet />
            </main>
        </div>
    );
}