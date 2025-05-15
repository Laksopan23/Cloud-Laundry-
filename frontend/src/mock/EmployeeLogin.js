import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/employees/login', credentials);

    // Check if admin credentials
    const isAdmin = credentials.username === 'admin' && credentials.password === 'admin';
    
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('role', isAdmin ? 'admin' : 'employee');

    alert(isAdmin ? 'Admin login successful' : 'Login successful');
    navigate('/');
  } catch (err) {
    alert('Login failed: ' + (err.response?.data?.message || err.message));
  }
};


  return (
    <form onSubmit={handleLogin}>
      <h2>Employee Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={credentials.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default EmployeeLogin;
