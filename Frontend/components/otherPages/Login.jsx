"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [passwordType, setPasswordType] = useState("password");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const togglePassword = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

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
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect to home page or dashboard
        router.push("/");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
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
              <h4>Login</h4>
            </div>
            
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
            
            <form onSubmit={handleSubmit} className="form-login form-has-password" suppressHydrationWarning>
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
                    suppressHydrationWarning
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
                
                <fieldset className="form-has-password">
                  <input
                    className={errors.password ? "error" : ""}
                    type={passwordType}
                    placeholder="Password*"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    tabIndex={3}
                    aria-required="true"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePassword}
                    suppressHydrationWarning
                  >
                    <i className={`icon ${passwordType === "password" ? "icon-eye" : "icon-eye-off"}`} />
                  </button>
                  {errors.password && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.password}
                    </div>
                  )}
                </fieldset>
              </div>
              
              <div className="button-submit text-center">
                <button 
                  type="submit"
                  className="tf-btn btn-fill w-100"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                >
                  <span className="text text-button">
                    {isSubmitting ? "Logging in..." : "Login"}
                  </span>
                </button>
              </div>
            </form>
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
