import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce'; // Optional: Use lodash.debounce
import '../pages/styles/Signup.css';
import logo from '../assets/logo.png';
import googleIcon from '../assets/google-icon.png';
import boyCharacter from '../assets/boy-character.png';

const EmployeeSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: '',
  });
  const navigate = useNavigate();

  // Debounced function to check username availability
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (!username) {
        setUsernameStatus({ checking: false, available: null, message: '' });
        return;
      }

      try {
        setUsernameStatus({ checking: true, available: null, message: 'Checking...' });
        const res = await axios.get('http://localhost:5000/api/employees/check-username', {
          params: { username },
        });
        setUsernameStatus({
          checking: false,
          available: res.data.available,
          message: res.data.message,
        });
      } catch (err) {
        setUsernameStatus({
          checking: false,
          available: null,
          message: 'Error checking username',
        });
      }
    }, 500), // 500ms debounce delay
    []
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username') {
      checkUsername(value); // Trigger username check
    }

    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password !== '');
    }
  };

  const handleCheckboxChange = () => {
    setAgreedToTerms(!agreedToTerms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      alert('Please agree to the terms & policy');
      return;
    }

    if (usernameStatus.available === false) {
      alert('Username is already taken');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/employees/signup', {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      alert('Signup successful');
      navigate('/mol');
    } catch (err) {
      alert('Signup failed: ' + err.response.data.message);
    }
  };

  const handleGoogleSignup = () => {
    alert('Google signup not implemented');
  };

  return (
    <div className="container">
      <div className="form-section">
        <img src={logo} alt="Cloud Laundry.lk" className="logo" />
        <h1 className="title">GET STARTED NOW</h1>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

            <label>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            {usernameStatus.message && (
              <p
                style={{
                  color: usernameStatus.available ? 'green' : 'red',
                  fontSize: '14px',
                  margin: '5px 0',
                }}
              >
                {usernameStatus.message}
              </p>
            )}

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
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

            <div className="checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleCheckboxChange}
              />
              <label>
                I agree to the <a href="#">terms & policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={!passwordMatch || !agreedToTerms || usernameStatus.available === false}
            >
              SignUp
            </button>

            <div className="or-separator">
              <hr />
              <span>OR</span>
              <hr />
            </div>

            <button type="button" className="google-btn" onClick={handleGoogleSignup}>
              <img src={googleIcon} alt="Google Icon" />
              Signup with Google
            </button>

            <p className="signin-text">
              Have an account? <a href="/">Sign In</a>
            </p>
          </form>
        </div>
      </div>

      <div className="image-section">
        <img src={boyCharacter} alt="Boy" className="illustration" />
      </div>
    </div>
  );
};

export default EmployeeSignup;