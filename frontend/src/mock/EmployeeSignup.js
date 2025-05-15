import React, { useState } from 'react';
import axios from 'axios';

const EmployeeSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/employees/signup', formData);
      alert('Signup successful');
    } catch (err) {
      alert('Signup failed: ' + err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Employee Signup</h2>
      <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Signup</button>
    </form>
  );
};

export default EmployeeSignup;
