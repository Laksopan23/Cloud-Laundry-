import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Email validation using regex
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/email/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("OTP sent to your email!");
        setTimeout(() => {
          navigate('/otp', { state: { email } });
        }, 100);
      } else {
        console.error("Error:", data.message);
        alert(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="main-container">
      <div className="image-side">
        <button onClick={handleBack} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <img src="/Frame 301.png" alt="Laundry Background" className="background-image" />
      </div>

      <div className="form-side">
        <div className="form-container" style={{ marginTop: '140px' }}>
          <img src="/cloud-logo-removebg-preview.png" alt="Cloud Laundry" className="logo" />
          <h2 className="title">FORGOT PASSWORD</h2>
          <p className="subtitle">Please enter your email to reset the password</p>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <div className="label-container">
                <label htmlFor="email">Your email</label>
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${!isValidEmail ? 'disabled' : ''}`}
              disabled={!isValidEmail}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
