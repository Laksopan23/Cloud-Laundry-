import React, { useState } from 'react';
import axios from 'axios';

const EmployeeSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time password matching check
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password !== '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/employees/signup', {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      alert('Signup successful');
    } catch (err) {
      alert('Signup failed: ' + err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Employee Signup</h2>
      <input 
        type="text" 
        name="name" 
        placeholder="Full Name" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        name="confirmPassword" 
        placeholder="Confirm Password" 
        onChange={handleChange} 
        required 
      />
      {!passwordMatch && formData.password && formData.confirmPassword && (
        <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
          Passwords do not match
        </p>
      )}
      <button type="submit" disabled={!passwordMatch}>
        Signup
      </button>
    </form>
  );
};

export default EmployeeSignup;