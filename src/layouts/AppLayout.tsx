import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { authActions } from "../store/auth/authSlice";

export default function AppLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const status = useAppSelector((s) => s.auth.status);
    const user = useAppSelector((s) => s.auth.user);

    const isAuthed = status === "authenticated";

    // ✅ Keep your interceptor-driven redirect behavior
    useEffect(() => {
        const handler = () => {
            // Ensure Redux state is also cleared (token was already cleared by interceptor)
            dispatch(authActions.logoutSucceeded?.() as any); // if you have it
            // If you don't have logoutSucceeded, just dispatch logoutRequested:
            // dispatch(authActions.logoutRequested());

            navigate("/login", { replace: true });
        };

        window.addEventListener("opsboard:unauthorized", handler);
        return () => window.removeEventListener("opsboard:unauthorized", handler);
    }, [dispatch, navigate]);

    const logout = () => {
        dispatch(authActions.logoutRequested());
        navigate("/login", { replace: true });
    };

    return (
        <div className="app">
            <header className="topbar">
                <div className="container topbarInner">
                    <div className="brand">OpsBoard</div>

                    <nav className="nav">
                        <NavLink to="/" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                            Home
                        </NavLink>

                        {!isAuthed && (
                            <>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                                    Login
                                </NavLink>
                                <NavLink to="/register" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                                    Register
                                </NavLink>
                            </>
                        )}

                        {isAuthed && (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/projects" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                                    Projects
                                </NavLink>
                                <NavLink to="/settings" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
                                    Settings
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div style={{ flex: 1 }} />

                    <div className="topbarRight">
                        {isAuthed && (
                            <>
                                <span className="mutedText">{user?.email}</span>
                                <button className="btn btnGhost" onClick={logout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="container main">
                <Outlet />
            </main>
        </div>
    );
}