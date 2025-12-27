import axios from 'axios';
import { useState } from 'react'
import {
  getActiveBackend,
  getApiBaseUrl
} from "./config/backend";

export default function App() {
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
    const loginResponse = await axios.post(`${getApiBaseUrl()}/api/auth/login`, formData);
    console.log(formData);
    console.log(loginResponse);
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
