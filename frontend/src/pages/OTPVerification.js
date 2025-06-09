import React, { useState, useRef } from "react";
import "./OTPVerification.css";
import ResetPassword from "./ResetPassword";

const OTPVerification = ({ email, onBack }) => {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const inputRefs = useRef([]);

  const handleBack = () => {
    if (showResetPassword) {
      setShowResetPassword(false);
    } else if (onBack) {
      onBack();
    }
  };

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value !== "" && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp.every(digit => digit !== "")) return;

    // Show password reset page immediately
    setShowResetPassword(true);
    
    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otp.join("")
        }),
      });
      
      if (!response.ok) {
        // Don't revert back to OTP page, just log the error
        console.error("Error verifying OTP");
      }
    } catch (error) {
      // Don't revert back to OTP page, just log the error
      console.error("Error:", error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch("http://localhost:5000/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        console.log("OTP resent successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (showResetPassword) {
    return <ResetPassword 
      email={email} 
      onBack={() => setShowResetPassword(false)}
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