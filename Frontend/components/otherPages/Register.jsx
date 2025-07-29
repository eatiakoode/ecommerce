"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

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
    
    if (!formData.firstname) {
      newErrors.firstname = "First name is required";
    }
    
    if (!formData.lastname) {
      newErrors.lastname = "Last name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        // Redirect to login page after successful registration
        router.push("/login?message=Registration successful! Please login.");
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
              <h4>Register</h4>
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
            
            <form onSubmit={handleSubmit} className="form-register" suppressHydrationWarning>
              <div className="wrap">
                <div className="row">
                  <div className="col-lg-6">
                <fieldset className="">
                  <input
                    className={errors.firstname ? "error" : ""}
                    type="text"
                        placeholder="First name*"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    tabIndex={2}
                    aria-required="true"
                    required
                        suppressHydrationWarning
                  />
                  {errors.firstname && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.firstname}
                    </div>
                  )}
                </fieldset>
                  </div>
                  <div className="col-lg-6">
                <fieldset className="">
                  <input
                    className={errors.lastname ? "error" : ""}
                    type="text"
                        placeholder="Last name*"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                        tabIndex={3}
                    aria-required="true"
                    required
                        suppressHydrationWarning
                  />
                  {errors.lastname && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.lastname}
                    </div>
                  )}
                </fieldset>
                  </div>
                </div>
                
                <fieldset className="">
                  <input
                    className={errors.email ? "error" : ""}
                    type="email"
                    placeholder="Email address*"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    tabIndex={4}
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
                
                <fieldset className="">
                  <input
                    className={errors.mobile ? "error" : ""}
                    type="tel"
                    placeholder="Mobile number*"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    tabIndex={5}
                    aria-required="true"
                    required
                    suppressHydrationWarning
                  />
                  {errors.mobile && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.mobile}
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
                    tabIndex={6}
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

                <fieldset className="form-has-password">
                  <input
                    className={errors.confirmPassword ? "error" : ""}
                    type={confirmPasswordType}
                    placeholder="Confirm password*"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    tabIndex={7}
                    aria-required="true"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPassword}
                    suppressHydrationWarning
                  >
                    <i className={`icon ${confirmPasswordType === "password" ? "icon-eye" : "icon-eye-off"}`} />
                  </button>
                  {errors.confirmPassword && (
                    <div className="error-message" style={{ 
                      color: "#dc3545", 
                      fontSize: "12px", 
                      marginTop: "5px" 
                    }}>
                      {errors.confirmPassword}
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
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="right">
            <h4 className="mb_8">Already have an account?</h4>
            <p className="text-secondary">
              Welcome back. Sign in to access your personalized experience,
              saved preferences, and more. We're thrilled to have you with us
              again!
            </p>
            <Link href={`/login`} className="tf-btn btn-fill">
              <span className="text text-button">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
