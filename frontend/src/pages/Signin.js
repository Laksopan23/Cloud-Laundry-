import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './styles/Signup.css'; 
import logo from '../assets/logo.png';
import googleIcon from '../assets/google-icon.png';
import boyCharacter from '../assets/boy-character.png';

const Signin = () => {
  return (
    <div className="container">
      <div className="form-section">
        <img src={logo} alt="Cloud Laundry.lk" className="logo" />
        <h1 className="title">SIGN IN TO YOUR ACCOUNT</h1>

        <div className="form-box">
          <form>
            <label>Email address</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

            <div className="checkbox">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>

            <button type="submit" className="signin-btn">Sign In</button>

            <div className="or-separator">
              <hr /><span>OR</span><hr />
            </div>

            <button type="button" className="google-btn">
              <img src={googleIcon} alt="Google Icon" />
              Sign in with Google
            </button>

            {/* Update the "Sign Up" link */}
            <p className="signup-text">
              Don't have an account? <Link to="/signup">Sign Up</Link>
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

export default Signin;
