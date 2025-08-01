"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPass() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
    
    try {
      const response = await fetch('http://localhost:5000/api/user/forgot-password-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ email: "" });

      } else {
        setErrors({ general: result.message || "Failed to send reset email. Please try again." });
      }
    } catch (error) {
      
      setErrors({ 
        general: "An unexpected error occurred. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="login-wrap">
          <div className="left">
            <div className="heading">
              <h4 className="mb_8">Reset your password</h4>
              <p>We will send you an email to reset your password</p>
            </div>
            
            {/* Success Message */}
            {isSuccess && (
              <div className="alert alert-success" style={{ 
                backgroundColor: "#d4edda", 
                color: "#155724", 
                padding: "10px", 
                borderRadius: "4px", 
                marginBottom: "20px",
                border: "1px solid #c3e6cb"
              }}>
                Password reset email sent successfully! Please check your email for further instructions.
              </div>
            )}
            
            {/* Error Message */}
            {errors.general && (
              <div className="alert alert-danger" style={{ 
                backgroundColor: "#f8d7da", 
                color: "#721c24", 
                padding: "10px", 
                borderRadius: "4px", 
                marginBottom: "20px",
                border: "1px solid #f5c6cb"
              }}>
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="form-login">
              <div className="wrap">
                <fieldset className="">
                  <input
                    className={errors.email ? "error" : ""}
                    type="email"
                    placeholder="Username or email address*"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    tabIndex={2}
                    aria-required="true"
                    required
                  />
                  {errors.email && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.email}
                    </div>
                  )}
                </fieldset>
              </div>
              <div className="button-submit">
                <button 
                  className="tf-btn btn-fill" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span className="text text-button">
                    {isSubmitting ? "Sending..." : "Submit"}
                  </span>
                </button>
              </div>
            </form>
            
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
                ← Back to Login
              </Link>
            </div>
          </div>
          <div className="right">
            <h4 className="mb_8">New Customer</h4>
            <p className="text-secondary">
              Be part of our growing family of new customers! Join us today and
              unlock a world of exclusive benefits, offers, and personalized
              experiences.
            </p>
            <Link href={`/register`} className="tf-btn btn-fill">
              <span className="text text-button">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
