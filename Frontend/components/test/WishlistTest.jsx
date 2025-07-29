"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export default function WishlistTest() {
  const { wishlistItems, loading, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const testProduct = {
    _id: "test-product-123",
    title: "Test Product",
    sellingPrice: 1000,
    MRP: 1200
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated()) {
      alert("Please login first!");
      return;
    }
    
    const result = await addToWishlist(testProduct._id);
    console.log("Add to wishlist result:", result);
  };

  const handleRemoveFromWishlist = async () => {
    if (wishlistItems.length > 0) {
      const firstItem = wishlistItems[0];
      const result = await removeFromWishlist(firstItem._id);
      console.log("Remove from wishlist result:", result);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Wishlist Test Component</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Authentication Status:</strong> {isAuthenticated() ? "Logged In" : "Not Logged In"}
      </div>
      
      {isAuthenticated() && (
        <div style={{ marginBottom: '10px' }}>
          <strong>User:</strong> {user?.email || user?.name || "Unknown"}
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Wishlist Count:</strong> {getWishlistCount()}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Loading:</strong> {loading ? "Yes" : "No"}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Wishlist Items:</strong>
        <ul>
          {wishlistItems.map((item, index) => (
            <li key={index}>
              {item.productId?.title || "Unknown Product"} - {item.productId?.sellingPrice || 0}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleAddToWishlist}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          Add Test Product to Wishlist
        </button>
        
        <button 
          onClick={handleRemoveFromWishlist}
          disabled={loading || wishlistItems.length === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || wishlistItems.length === 0) ? 'not-allowed' : 'pointer',
            opacity: (loading || wishlistItems.length === 0) ? 0.6 : 1
          }}
        >
          Remove First Item
        </button>
        
        <button 
          onClick={() => console.log("Is test product in wishlist:", isInWishlist(testProduct._id))}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Check Test Product Status
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
} 