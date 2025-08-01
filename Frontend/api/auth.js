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

    const data = await response.json();

    if (!response.ok) {
      // Return error without throwing to prevent console errors
      return { 
        success: false, 
        error: data.message || "Login failed" 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred. Please try again." 
    };
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

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Registration failed" 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Registration error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred. Please try again." 
    };
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

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Forgot password request failed" 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred. Please try again." 
    };
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
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Logout failed" 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred during logout" 
    };
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

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || "Failed to fetch user profile" 
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Get profile error:", error);
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred while fetching profile" 
    };
  }
};

// Update User Profile
export const updateUserProfile = async (token, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/edit-user`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message };
  }
};

// Change Password
export const changePassword = async (token, passwordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to change password");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, error: error.message };
  }
};

// Cart API functions
export const getCart = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get cart error:", error);
    return { success: false, error: error.message };
  }
};

// Get default color and size IDs
const getDefaultColorAndSize = async () => {
  try {
    // Get all colors and sizes
    const [colorResponse, sizeResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/color`),
      fetch(`${API_BASE_URL}/size`)
    ]);

    const colors = await colorResponse.json();
    const sizes = await sizeResponse.json();

    // Get first available color and size, or create defaults if none exist
    const defaultColor = colors.length > 0 ? colors[0]._id : null;
    const defaultSize = sizes.length > 0 ? sizes[0]._id : null;

    return { defaultColor, defaultSize };
  } catch (error) {
    console.error("Error getting default color/size:", error);
    return { defaultColor: null, defaultSize: null };
  }
};

export const addToCart = async (token, cartData) => {
  try {
    console.log("Sending cart data:", cartData);
    
    // If color and size are not provided (wishlist case), get defaults
    if (!cartData.color || !cartData.size) {
      const { defaultColor, defaultSize } = await getDefaultColorAndSize();
      
      if (!defaultColor || !defaultSize) {
        throw new Error("No default color or size available. Please contact support.");
      }
      
      cartData.color = defaultColor;
      cartData.size = defaultSize;
      
      console.log("Using default color/size:", { color: defaultColor, size: defaultSize });
    }
    
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    });

    const responseData = await response.json();
    console.log("Cart response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to add to cart");
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, error: error.message };
  }
};

export const updateCartItem = async (token, cartItemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-product-cart/${cartItemId}/${quantity}`, {
      method: "DELETE", // Note: This is DELETE method as per the route
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update cart item");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Update cart item error:", error);
    return { success: false, error: error.message };
  }
};

export const removeFromCart = async (token, cartItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-product-cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove from cart");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return { success: false, error: error.message };
  }
};

// Wishlist API functions
export const getWishlist = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch wishlist");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Get wishlist error:", error);
    return { success: false, error: error.message };
  }
};

export const addToWishlist = async (token, productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    // Handle both 200 and 201 status codes as success
    if (response.status === 200 || response.status === 201) {
      return { success: true, data };
    } else {
      // Handle error responses (like 400 for "already in wishlist")
      const errorMessage = data.message || "Failed to add to wishlist";
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error("Add to wishlist error:", error);
    return { success: false, error: error.message };
  }
};

export const removeFromWishlist = async (token, wishlistItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${wishlistItemId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove from wishlist");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return { success: false, error: error.message };
  }
}; 

// Order API functions
export const getUserOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getmyorders`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user orders");
    }

    const data = await response.json();
    return { success: true, data: data.orders };
  } catch (error) {
    console.error("Get user orders error:", error);
    return { success: false, error: error.message };
  }
};

export const getOrderDetails = async (token, orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getmyorder/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch order details: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.order };
  } catch (error) {
    console.error("Get order details error:", error);
    return { success: false, error: error.message };
  }
}; 