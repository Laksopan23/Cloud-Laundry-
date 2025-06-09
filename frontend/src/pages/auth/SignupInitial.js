import React from 'react';
import '../styles/Signup.css'; // Import your CSS file for styling
import logo from '../../assets/logo.png'; // Import your logo image
import googleIcon from '../../assets/google-icon.png'; // Import your Google icon image
import boyCharacter from '../../assets/boy-character.png'; //


const Signup = () => {
  return (
    <div className="container">
      <div className="form-section">
        <img src={logo} alt="Cloud Laundry.lk" className="logo" />
        <h1 className="title">GET STARTED NOW</h1>

        <div className="form-box">
          <form>
            <label>Name</label>
            <input type="text" placeholder="Name" />

            <label>Email address</label>
            <input type="email" placeholder="email" />

            <label>Password</label>
            <input type="password" placeholder="Password" />

            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" />

            <div className="checkbox">
              <input type="checkbox" />
              <label>I agree to the <a href="#">terms & policy</a></label>
            </div>

            <button type="submit" className="signup-btn">SignUp</button>

            <div className="or-separator">
              <hr /><span>OR</span><hr />
            </div>

            <button type="button" className="google-btn">
              <img src={googleIcon} alt="Google Icon" />
              Signup with Google
            </button>

            <p className="signin-text">
              Have an account? <a href="#">Sign In</a>
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

export default Signup;
