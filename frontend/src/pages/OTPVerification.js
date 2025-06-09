import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./OTPVerification.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  if (!email) {
    navigate('/pass');
    return null;
  }

  const handleBack = () => {
    navigate('/pass');
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.every(digit => digit !== "")) return;

    try {
      const response = await fetch("http://localhost:5000/api/email/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join("")
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        navigate('/reset-password', { state: { email } });
      } else {
        console.error("Error verifying OTP:", data.message);
        alert(data.message || "Invalid or expired OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/email/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("New OTP sent to your email.");
      } else {
        console.error("Error resending OTP:", data.message);
        alert(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resending OTP. Please try again.");
    }
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
          <h2 className="title">Check your email</h2>
          <p className="subtitle">
            sent a reset link to {email} enter code mentioned in the email
          </p>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  autoComplete="off"
                />
              ))}
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${!otp.every(digit => digit !== "") ? 'disabled' : ''}`}
              disabled={!otp.every(digit => digit !== "")}
            >
              Verify Code
            </button>
          </form>

          <div className="resend-container">
            <span>Haven't got the email yet? </span>
            <button onClick={handleResendEmail} className="resend-link">
              Resend email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 