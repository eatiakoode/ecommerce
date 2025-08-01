"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { resetPassword } from "@/api/auth";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token;
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setMessage({ type: "error", text: "Password is required" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await resetPassword(token, password);
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: "Password has been reset successfully! You can now log in with your new password." 
        });
        setPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* page-title */}
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Reset Password</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Reset Password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* /page-title */}

      <section className="flat-spacing">
        <div className="container">
          <div className="reset-password-wrap" style={{ 
            maxWidth: "500px", 
            margin: "0 auto", 
            padding: "40px 20px" 
          }}>
            <div className="reset-password-content" style={{ 
              backgroundColor: "white", 
              padding: "40px", 
              borderRadius: "8px", 
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)" 
            }}>
              <h4 style={{ textAlign: "center", marginBottom: "30px" }}>
                Reset Your Password
              </h4>
              
              <p style={{ 
                textAlign: "center", 
                color: "#666", 
                marginBottom: "30px",
                lineHeight: "1.6"
              }}>
                Enter your new password below to complete the reset process.
              </p>

              {/* Message Display */}
              {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} 
                     style={{ 
                       backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", 
                       color: message.type === "success" ? "#155724" : "#721c24", 
                       padding: "15px", 
                       borderRadius: "4px", 
                       marginBottom: "20px",
                       border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
                     }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="password" style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500" 
                  }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={passwordType}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your new password"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        paddingRight: "50px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "16px"
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      {passwordType === "password" ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label htmlFor="confirmPassword" style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500" 
                  }}>
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={confirmPasswordType}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        paddingRight: "50px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "16px"
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPassword}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      {confirmPasswordType === "password" ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div style={{ 
                textAlign: "center", 
                marginTop: "30px", 
                paddingTop: "20px", 
                borderTop: "1px solid #eee" 
              }}>
                <p style={{ margin: "0", color: "#666" }}>
                  Remember your password?{" "}
                  <Link href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 