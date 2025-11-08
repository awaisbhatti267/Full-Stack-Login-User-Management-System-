// ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../ForgotPassword/forgetpassword.css"; // optional: reuse same CSS styling

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(null);

  // ✅ Check token validity when page loads
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/reset-password/${token}`);
        const data = await res.json();
        setTokenValid(data.valid);
        if (!data.valid) setMessage("❌ Invalid or expired reset link.");
      } catch (error) {
        console.error("Token validation error:", error);
        setMessage("⚠️ Unable to validate reset link.");
      }
    };
    checkToken();
  }, [token]);

  // ✅ Submit new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("⚠️ Please enter a new password.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1>Reset Password</h1>

        {tokenValid === false ? (
          <p className="error">Invalid or expired reset link.</p>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="reset-btn">
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
