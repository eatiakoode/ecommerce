"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  getUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress,
  setDefaultAddress 
} from "@/api/address";
import { countries } from "@/data/countries";
import { indianStates } from "@/data/states";

export default function Address() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: "Home",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    isDefault: false,
  });

  // Load addresses when component mounts
  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const result = await getUserAddresses(token);
      
      if (result.success) {
        setAddresses(result.data || []);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch addresses" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "Home",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.country) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let result;
      if (editingAddress) {
        // Update existing address
        result = await updateAddress(token, editingAddress._id, formData);
      } else {
        // Create new address
        result = await createAddress(token, formData);
      }
      
      if (result.success) {
        setMessage({ 
          type: "success", 
          text: editingAddress ? "Address updated successfully!" : "Address added successfully!" 
        });
        resetForm();
        fetchAddresses(); // Refresh the list
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const result = await deleteAddress(token, addressId);
      
      if (result.success) {
        setMessage({ type: "success", text: "Address deleted successfully!" });
        fetchAddresses(); // Refresh the list
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete address" });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const result = await setDefaultAddress(token, addressId);
      
      if (result.success) {
        setMessage({ type: "success", text: "Default address updated successfully!" });
        fetchAddresses(); // Refresh the list
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to set default address" });
    }
  };

  // Check if India is selected to show states dropdown
  const isIndiaSelected = formData.country === "India";

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="account-address">
          <div className="text-center widget-inner-address">
            <div className="loading-spinner" style={{ textAlign: "center", padding: "50px" }}>
              <div>Loading addresses...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content">
      <div className="account-address">
        <div className="text-center widget-inner-address">
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

          <button
            className="tf-btn btn-fill radius-4 mb_20 btn-address"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <span className="text text-caption-1">Add a new address</span>
          </button>

          {(showAddForm || editingAddress) && (
          <form
              className="show-form-address wd-form-address createForm d-block"
              onSubmit={handleSubmit}
          >
              <div className="title">{editingAddress ? "Edit address" : "Add a new address"}</div>
            <div className="cols mb_20">
              <fieldset className="">
                <input
                  className=""
                  type="text"
                  placeholder="First Name*"
                    name="firstName"
                  tabIndex={2}
                    value={formData.firstName}
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
                    name="lastName"
                  tabIndex={2}
                    value={formData.lastName}
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
                    placeholder="Email*"
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
                    name="phone"
                  tabIndex={2}
                    value={formData.phone}
                    onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
            </div>
            <fieldset className="mb_20">
              <input
                className=""
                type="text"
                  placeholder="Address*"
                  name="address"
                  tabIndex={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  aria-required="true"
                  required
                />
              </fieldset>
              <div className="cols mb_20">
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="City*"
                    name="city"
                    tabIndex={2}
                    value={formData.city}
                    onChange={handleInputChange}
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="">
                  <input
                    className=""
                    type="text"
                    placeholder="State/Province*"
                    name="state"
                tabIndex={2}
                    value={formData.state}
                    onChange={handleInputChange}
                aria-required="true"
                required
              />
            </fieldset>
              </div>
              <div className="cols mb_20">
                <div className="tf-select">
              <select
                className="text-title"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                data-default=""
                    required
                  >
                    <option value="">Select Country*</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                </option>
                    ))}
              </select>
            </div>
                <fieldset className="">
              <input
                className=""
                type="text"
                    placeholder="ZIP/Postal Code*"
                    name="zipCode"
                tabIndex={2}
                    value={formData.zipCode}
                    onChange={handleInputChange}
                aria-required="true"
                required
              />
            </fieldset>
              </div>
              {/* Dynamic States Dropdown - Only for India */}
              {isIndiaSelected && (
                <div className="tf-select mb_20">
                  <select
                    className="text-title"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    data-default=""
                    required
                  >
                    <option value="">Select State*</option>
                    {indianStates.map((state) => (
                      <option key={state.code} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="tf-select mb_20">
                <select
                  className="text-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  data-default=""
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Default">Default</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            <div className="tf-cart-checkbox mb_20">
              <div className="tf-checkbox-wrapp">
                <input
                    checked={formData.isDefault}
                  className=""
                  type="checkbox"
                  id="CartDrawer-Form_agree"
                    name="isDefault"
                    onChange={handleInputChange}
                />
                <div>
                  <i className="icon-check" />
                </div>
              </div>
              <label htmlFor="CartDrawer-Form_agree">
                Set as default address.
              </label>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-20">
                <button 
                  type="submit" 
                  className="tf-btn btn-fill radius-4"
                  disabled={isSubmitting}
                >
                  <span className="text">
                    {isSubmitting 
                      ? (editingAddress ? "Updating..." : "Adding...") 
                      : (editingAddress ? "Update address" : "Add address")
                    }
                  </span>
              </button>
              <span
                className="tf-btn btn-fill radius-4 btn-hide-address"
                  onClick={resetForm}
              >
                <span className="text">Cancel</span>
              </span>
            </div>
          </form>
          )}

          <div className="list-account-address">
            {addresses.length === 0 ? (
              <div className="empty-addresses" style={{ textAlign: "center", padding: "50px" }}>
                <div style={{ fontSize: "24px", marginBottom: "20px" }}>No addresses found</div>
                <p style={{ color: "#666", marginBottom: "30px" }}>
                  Add your first address to get started.
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div className="account-address-item" key={address._id}>
                  <h6 className="mb_20">
                    {address.title} {address.isDefault && <span style={{ color: "#007bff", fontSize: "12px" }}>(Default)</span>}
                  </h6>
                  <p>{address.firstName} {address.lastName}</p>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>{address.country} {address.zipCode}</p>
                  <p>{address.email}</p>
                <p className="mb_10">{address.phone}</p>
                <div className="d-flex gap-10 justify-content-center">
                  <button
                    className="tf-btn radius-4 btn-fill justify-content-center btn-edit-address"
                      onClick={() => handleEdit(address)}
                  >
                      <span className="text">Edit</span>
                  </button>
                  <button
                    className="tf-btn radius-4 btn-outline justify-content-center btn-delete-address"
                      onClick={() => handleDelete(address._id)}
                  >
                    <span className="text">Delete</span>
                  </button>
                    {!address.isDefault && (
                      <button
                        className="tf-btn radius-4 btn-outline justify-content-center"
                        onClick={() => handleSetDefault(address._id)}
                        style={{ backgroundColor: "#28a745", color: "white", border: "1px solid #28a745" }}
                      >
                        <span className="text">Set Default</span>
                      </button>
                )}
              </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
