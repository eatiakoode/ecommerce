"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!isAuthenticated()) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/wishlist", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Failed to fetch wishlist:", res.status);
        setWishlistItems([]);
        return;
      }

      const wishlistData = await res.json();
      console.log("Wishlist data fetched:", wishlistData);
      setWishlistItems(wishlistData);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated()) {
      alert("Please login to add items to wishlist");
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        // Success case - product was added
        alert(result.message || "Product added to wishlist!");
        await fetchWishlist(); // Refresh wishlist
        return true;
      } else {
        // Handle specific error cases
        if (res.status === 400 && result.message === "Product already in wishlist") {
          // This is not really an error - the product is already in wishlist
          alert("Product is already in your wishlist!");
          return true;
        } else {
          // Handle other errors
          console.error("Wishlist error response:", result);
          alert("Error adding to wishlist: " + (result.message || "Unknown error"));
          return false;
        }
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      alert("Error adding to wishlist: " + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    if (!isAuthenticated()) {
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/user/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        await fetchWishlist(); // Refresh wishlist
        return true;
      } else {
        console.error("Failed to remove from wishlist:", res.status);
        return false;
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    console.log("Checking if product is in wishlist:", productId);
    console.log("Current wishlist items:", wishlistItems);
    
    const isInWishlist = wishlistItems.some(item => {
      // Handle populated productId (contains full product object)
      if (item.productId && typeof item.productId === 'object' && item.productId._id) {
        return item.productId._id === productId;
      }
      // Handle direct productId (string/ObjectId)
      return item.productId === productId;
    });
    
    console.log("Is in wishlist:", isInWishlist);
    return isInWishlist;
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Fetch wishlist when authentication changes
  useEffect(() => {
    fetchWishlist();
  }, [token, isAuthenticated]);

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}; 