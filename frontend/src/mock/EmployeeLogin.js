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
    const { username, role } = res.data;

    localStorage.setItem('username', username);
    localStorage.setItem('role', role);

    //alert(role === 'admin' ? 'Admin login successful' : 'Login successful');
    if (role== 'admin'){
       navigate('/admin');
    }
    else{
       navigate('/');
    }

  } catch (err) {
    alert('Login failed: ' + (err.response?.data?.message || err.message));
  }
};



  return (
    <form onSubmit={handleLogin}>
      <h2> Login</h2>
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
