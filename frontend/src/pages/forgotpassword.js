import React, { useState, useEffect } from "react";
import "./ForgotPassword.css";
import OTPVerification from "./OTPVerification";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail) return;
    
    // Show OTP page immediately
    setShowOTP(true);
    
    // Handle API call in the background
    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    if (showOTP) {
      setShowOTP(false);
    } else {
      window.history.back();
    }
  };

  if (showOTP) {
    return <OTPVerification 
      email={email} 
      onBack={() => setShowOTP(false)}
    />;
  }

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
        <div className="form-container">
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
