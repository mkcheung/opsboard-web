import { http } from "../../shared/api/http";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { setToken } from "../../shared/auth/token";
import { validateEmail } from "../../shared/utils/helper";

export const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirm: ''
    });
    const [failure, setFailure] = useState('')


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailValid = validateEmail(formData.email);
        if (formData.password !== "" && (formData.password === formData.password_confirm) && emailValid) {
            const registerResponse = await http.post('/api/auth/register', formData);
            if (registerResponse.status === 201) {
                setFailure('');
                setToken(registerResponse.data.token)
                navigate('/login')
            } else {
                console.error(`Error in User Registration Submission`);
                setFailure('Error in User Registration Submission');
            }
        } else if (!emailValid) {
            console.error('Email format is invalid.');
            setFailure('Email format is invalid.');
        } else {
            console.error('Passwords must match.');
            setFailure('Passwords must match.');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        } catch (err) {
            console.error(`Error in User Registration: ${err}`);
            setFailure('Error in User Registration Submission');
        }
    }

    return <div>
        {failure && <div role="alert">{failure}</div>}
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name: </label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}>
            </input>
            <label htmlFor="email">Email: </label>
            <input id="email" name="email" type="text" value={formData.email} onChange={handleChange}>
            </input>
            <label htmlFor="password">Password: </label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange}>
            </input>
            <label htmlFor="password_confirm">Password Confirm:</label>
            <input id="password_confirm" name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange}>
            </input>
            <button type="submit">Submit</button>
        </form>
    </div>
}

export default Register;