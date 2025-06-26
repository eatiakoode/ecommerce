const API_BASE_URL = "http://localhost:5000/api/user";

// Login API
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
};

// Register API
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
};

// Forgot Password API
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/forgot-password-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Forgot password request failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, error: error.message };
  }
};

// Reset Password API
export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-password/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Password reset failed");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, error: error.message };
  }
};

// Logout API
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      credentials: "include", // Include cookies for logout
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Get User Profile (requires authentication)
export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, error: error.message };
  }
}; 