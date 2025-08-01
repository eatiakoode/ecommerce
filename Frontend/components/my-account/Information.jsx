"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile, changePassword } from "@/api/auth";
import { countries } from "@/data/countries";

export default function Information() {
  const { user, token, getProfile } = useAuth();
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    country: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile: user.mobile || "",
        country: user.country || ""
      });
    }
  }, [user]);

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

  const toggleNewPassword = () => {
    setNewPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateProfileForm = () => {
    if (!formData.firstname.trim()) {
      setMessage({ type: "error", text: "First name is required" });
      return false;
    }
    if (!formData.lastname.trim()) {
      setMessage({ type: "error", text: "Last name is required" });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email is required" });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email" });
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return false;
    }
    if (!passwordData.newPassword) {
      setMessage({ type: "error", text: "New password is required" });
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return false;
    }
    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await updateUserProfile(token, formData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Try to refresh user data, but don't fail if it doesn't work
        try {
          await getProfile();
        } catch (profileError) {
          console.error("Failed to refresh profile:", profileError);
          // Don't show error to user since profile update was successful
        }
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await changePassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (result.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
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
    <div className="my-account-content">
      <div className="account-details">
        {/* Message Display */}
        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} 
               style={{ 
                 backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da", 
                 color: message.type === "success" ? "#155724" : "#721c24", 
                 padding: "10px", 
                 borderRadius: "4px", 
                 marginBottom: "20px",
                 border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`
               }}>
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleProfileSubmit}
          className="form-account-details form-has-password"
        >
          <div className="account-info">
            <h5 className="title">Information</h5>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="First Name*"
                  name="firstname"
                  tabIndex={2}
                  value={formData.firstname}
                  onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Last Name*"
                  name="lastname"
                  tabIndex={2}
                  value={formData.lastname}
                  onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="email"
                  placeholder="Username or email address*"
                  name="email"
                  tabIndex={2}
                  value={formData.email}
                  onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="Phone*"
                  name="mobile"
                  tabIndex={2}
                  value={formData.mobile}
                  onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <div className="tf-select">
              <select
                className="text-title"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                data-default=""
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="button-submit">
            <button 
              className="tf-btn btn-fill" 
              type="submit"
              disabled={isSubmitting}
            >
              <span className="text text-button">
                {isSubmitting ? "Updating..." : "Update Account"}
              </span>
            </button>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="form-account-details form-has-password"
          style={{ marginTop: "40px" }}
        >
          <div className="account-password">
            <h5 className="title">Change Password</h5>
            <fieldset className="position-relative password-item mb_20">
              <input
                className="input-password"
                type={passwordType}
                placeholder="Current Password*"
                name="currentPassword"
                tabIndex={2}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                aria-required="true"
                required
              />
              <span
                className={`toggle-password ${
                  !(passwordType === "text") ? "unshow" : ""
                }`}
                onClick={togglePassword}
              >
                <i
                  className={`icon-eye-${
                    !(passwordType === "text") ? "hide" : "show"
                  }-line`}
                />
              </span>
            </fieldset>
            <fieldset className="position-relative password-item mb_20">
              <input
                className="input-password"
                type={newPasswordType}
                placeholder="New Password*"
                name="newPassword"
                tabIndex={2}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                aria-required="true"
                required
              />
              <span
                className={`toggle-password ${
                  !(newPasswordType === "text") ? "unshow" : ""
                }`}
                onClick={toggleNewPassword}
              >
                <i
                  className={`icon-eye-${
                    !(newPasswordType === "text") ? "hide" : "show"
                  }-line`}
                />
              </span>
            </fieldset>
            <fieldset className="position-relative password-item">
              <input
                className="input-password"
                type={confirmPasswordType}
                placeholder="Confirm Password*"
                name="confirmPassword"
                tabIndex={2}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                aria-required="true"
                required
              />
              <span
                className={`toggle-password ${
                  !(confirmPasswordType === "text") ? "unshow" : ""
                }`}
                onClick={toggleConfirmPassword}
              >
                <i
                  className={`icon-eye-${
                    !(confirmPasswordType === "text") ? "hide" : "show"
                  }-line`}
                />
              </span>
            </fieldset>
          </div>
          <div className="button-submit">
            <button 
              className="tf-btn btn-fill" 
              type="submit"
              disabled={isSubmitting}
            >
              <span className="text text-button">
                {isSubmitting ? "Changing..." : "Change Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
