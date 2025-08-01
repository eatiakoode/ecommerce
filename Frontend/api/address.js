const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Get all addresses for user
export const getUserAddresses = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch addresses: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get addresses error:", error);
    return { success: false, error: error.message };
  }
};

// Get single address
export const getAddress = async (token, addressId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch address: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Get address error:", error);
    return { success: false, error: error.message };
  }
};

// Create new address
export const createAddress = async (token, addressData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create address: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Create address error:", error);
    return { success: false, error: error.message };
  }
};

// Update address
export const updateAddress = async (token, addressId, addressData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update address: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Update address error:", error);
    return { success: false, error: error.message };
  }
};

// Delete address
export const deleteAddress = async (token, addressId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${addressId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete address: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Delete address error:", error);
    return { success: false, error: error.message };
  }
};

// Set default address
export const setDefaultAddress = async (token, addressId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${addressId}/default`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set default address: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Set default address error:", error);
    return { success: false, error: error.message };
  }
}; 