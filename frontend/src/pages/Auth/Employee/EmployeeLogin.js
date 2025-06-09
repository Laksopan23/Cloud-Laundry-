import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Signup.css';
import logo from '../../../assets/logo.png';
import googleIcon from '../../../assets/google-icon.png';
import boyCharacter from '../../../assets/boy-character.png';

const EmployeeLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
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

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dash');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="form-section">
        <img src={logo} alt="Cloud Laundry.lk" className="logo" />
        <h1 className="title">SIGN IN TO YOUR ACCOUNT</h1>

        <div className="form-box">
          <form onSubmit={handleLogin}>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />

            <p className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </p>

            <div className="checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="signin-btn">Sign In</button>

            <div className="or-separator">
              <hr /><span>OR</span><hr />
            </div>

            <button type="button" className="google-btn">
              <img src={googleIcon} alt="Google Icon" />
              Sign in with Google
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/SignUp">Sign Up</Link>
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

export default EmployeeLogin;
