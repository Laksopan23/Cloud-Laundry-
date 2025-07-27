import React from "react";
import "./ForgotPassword.css";

const PasswordResetSuccess = () => {
  const handleContinue = () => {
    // Navigate to login page or home page
    window.location.href = "/";
  };

  return (
    <div className="main-container">
      <div className="image-side">
        <img
          src="/Frame 301.png"
          alt="Laundry Background"
          className="background-image"
        />
      </div>

      <div className="form-side">
        <div
          className="form-container success-container"
          style={{ marginTop: "70px" }}
        >
          <img
            src="/cloud-logo-removebg-preview.png"
            alt="Cloud Laundry"
            className="logo"
          />

          <div className="success-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="39" stroke="#6B4EFF" strokeWidth="2" />
              <path
                d="M25 40L35 50L55 30"
                stroke="#6B4EFF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="title">Successfully</h2>
          <p className="subtitle success-message">
            Congratulations!
            <br />
            Your password has been changed
          </p>

          <button
            onClick={handleContinue}
            className="submit-button continue-button"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
