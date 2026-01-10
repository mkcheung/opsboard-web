import {
    getActiveBackend,
    getApiBaseUrl
} from "../../shared/config/backend";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth/authSlice";
import {
    useAppDispatch,
    useAppSelector
} from "../../store/hooks/hooks";

const Login = () => {

    const dispatch = useAppDispatch();
    const status = useAppSelector((s) => s.auth.status);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (status === "authenticated") {
            navigate("/dashboard", { replace: true });
        }
    }, [status, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(authActions.loginRequested(formData));
    };

    const isSubmitting = status === "loading";

    return (
        <div className="container">
            <div className="authWrap">
                <div className="card authCard">
                    <div className="cardBody">
                        <div className="pageHeader" style={{ marginBottom: 10 }}>
                            <div>
                                <h2 style={{ margin: 0, fontWeight: 900, letterSpacing: -0.3 }}>
                                    Opsboard
                                </h2>
                                <div className="mutedText" style={{ marginTop: 4, fontSize: 13 }}>
                                    Sign in to continue
                                </div>
                            </div>
                        </div>

                        {/* Debug info: keep it, but make it subtle */}
                        <div className="mutedText" style={{ fontSize: 12, marginBottom: 12 }}>
                            <div>Backend: {getActiveBackend()}</div>
                            <div>Base URL: {getApiBaseUrl()}</div>
                        </div>

                        <form className="form" onSubmit={handleForm}>
                            <div className="field">
                                <label className="label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="input"
                                    value={formData.email}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label className="label" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="input"
                                    value={formData.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>

                            {status === "error" ? (
                                <div className="taskError" style={{ marginTop: 6 }}>
                                    Login failed. Please check your credentials.
                                </div>
                            ) : null}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;