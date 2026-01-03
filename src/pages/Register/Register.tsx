import { http } from "../../shared/api/http";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../shared/auth/token";
import { validateEmail } from "../../shared/utils/helper";
import { useAppDispatch } from "../../store/hooks/hooks";
import { uiActions } from "../../features/ui/uiSlice";
import { loginMessages } from "../../features/ui/toastMessages";

export const Register = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirm: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const emailValid = validateEmail(formData.email);
        const pwMatch = formData.password !== "" && formData.password === formData.password_confirm;

        if (!emailValid) {
            dispatch(uiActions.toastAdded({ kind: "error", message: "Email format is invalid." }));
            return;
        }
        if (!pwMatch) {
            dispatch(uiActions.toastAdded({ kind: "error", message: "Passwords must match." }));
            return;
        }

        try {
            const res = await http.post("/api/auth/register", formData);
            if (res.status === 201) {
                setToken(res.data.token);
                dispatch(uiActions.toastAdded({ kind: "success", message: loginMessages.registered }));
                navigate("/login");
            } else {
                dispatch(uiActions.toastAdded({ kind: "error", message: "Registration failed." }));
            }
        } catch {
            dispatch(uiActions.toastAdded({ kind: "error", message: "Registration failed." }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">Create account</h1>
            </div>

            <div className="card">
                <div className="cardBody">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="field">
                            <div className="label">Name</div>
                            <input className="input" name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="field">
                            <div className="label">Email</div>
                            <input className="input" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="field">
                            <div className="label">Password</div>
                            <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>

                        <div className="field">
                            <div className="label">Confirm password</div>
                            <input className="input" type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} />
                        </div>

                        <button className="btn btnPrimary" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
