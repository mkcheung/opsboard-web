import { http } from "../../shared/api/http";
import {
    getActiveBackend,
    getApiBaseUrl
} from "../../shared/config/backend";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth/authSlice";
import { useAppDispatch } from "../../store/hooks/hooks";
import { useAppSelector } from "../../store/hooks/hooks";

const Login = () => {

    const dispatch = useAppDispatch();
    const status = useAppSelector((s) => s.auth.status);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (status === "authenticated") {
            navigate("/dashboard", { replace: true });
        }
    }, [status, navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(authActions.loginRequested(formData))
        } catch (error) {
            console.error('Login Failed');
        }

    }

    return <div>
        <h2>
            Opsboard
        </h2>

        <div>Backend: {getActiveBackend()}</div>
        <div>Base URL: {getApiBaseUrl()}</div>
        <form onSubmit={handleForm}>
            <label htmlFor='email'>Email:</label>
            <input value={formData.email} id="email" name="email" type='text' onChange={handleChange}></input>
            <label htmlFor='password'>Password:</label>
            <input value={formData.password} id="password" name="password" type="password" onChange={handleChange}></input>
            <button type='submit'>Login</button>
        </form>
    </div>;
}

export default Login