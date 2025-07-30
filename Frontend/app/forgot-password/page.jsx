"use client";
import React, { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: "Password reset link has been sent to your email. Please check your inbox." 
        });
        setEmail("");
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
              <h3 className="heading text-center">Forgot Password</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Forgot Password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* /page-title */}

      <section className="flat-spacing">
        <div className="container">
          <div className="forgot-password-wrap" style={{ 
            maxWidth: "500px", 
            margin: "0 auto", 
            padding: "40px 20px" 
          }}>
            <div className="forgot-password-content" style={{ 
              backgroundColor: "white", 
              padding: "40px", 
              borderRadius: "8px", 
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)" 
            }}>
              <h4 style={{ textAlign: "center", marginBottom: "30px" }}>
                Forgot Your Password?
              </h4>
              
              <p style={{ 
                textAlign: "center", 
                color: "#666", 
                marginBottom: "30px",
                lineHeight: "1.6"
              }}>
                Enter your email address below and we'll send you a link to reset your password.
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
                  <label htmlFor="email" style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500" 
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px"
                    }}
                    required
                  />
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
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
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