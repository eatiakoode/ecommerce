"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, getUserProfile } from "@/api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await loginUser(credentials);
      
      if (result.success) {
        const { token: authToken, ...userData } = result.data;
        
        // Save to localStorage
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Update state
        setToken(authToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await registerUser(userData);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      await logoutUser();
      
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      
      // Clear state
      setToken(null);
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Get user profile
  const getProfile = async () => {
    if (!token) return null;
    
    try {
      const result = await getUserProfile(token);
      if (result.success) {
        setUser(result.data);
        localStorage.setItem("user", JSON.stringify(result.data));
        return result.data;
      }
    } catch (error) {
      console.error("Get profile error:", error);
    }
    return null;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    getProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 