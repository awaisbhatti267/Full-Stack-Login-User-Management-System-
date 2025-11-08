// Forget Password

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ForgotPassword/forgetpassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password reset email sent! Check your inbox.");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error("Forgot Password error:", error);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1>Forgot Password</h1>
        <p className="subtitle">Enter your email to reset your password</p>

        <form onSubmit={handleForgotPassword}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <p className="back-login">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
