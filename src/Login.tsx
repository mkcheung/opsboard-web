import { http } from "./api/http";
import {
    getActiveBackend,
    getApiBaseUrl
} from "./config/backend";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { setToken } from "./auth/token";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleForm = async (e) => {
        e.preventDefault();
        try {
            const loginResponse = await http.post(`${getApiBaseUrl()}/api/auth/login`, formData);
            if (loginResponse.status === 200) {
                setToken(loginResponse.data.token);
                navigate('/dashboard')
            } else {
                console.error('Login Failed - please try again');
            }
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