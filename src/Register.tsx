import { http } from "./api/http";
import { useState } from 'react';
import {
    getApiBaseUrl
} from "./config/backend";

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirm: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerResponse = await http.post(`${getApiBaseUrl()}/api/auth/register`, formData);
        console.log(formData);
        console.log(registerResponse);
    }

    const handleChange = (e) => {
        try {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        } catch (err) {
            console.error(`Error in User Registration: ${err}`);
        }
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name: </label>
            <input id="name" name="name" type="text" onChange={handleChange}>
            </input>
            <label htmlFor="email">Email: </label>
            <input id="email" name="email" type="text" onChange={handleChange}>
            </input>
            <label htmlFor="password">Password: </label>
            <input id="password" name="password" type="password" onChange={handleChange}>
            </input>
            <label htmlFor="password">Password Confirm:</label>
            <input id="password_confirm" name="password_confirm" type="password" onChange={handleChange}>
            </input>
        </form>
    </div>
}

export default Register;