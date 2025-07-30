"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getWishlist, removeFromWishlist, addToCart } from "@/api/auth";

export default function WishlistContent() {
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const result = await getWishlist(token);
      
      if (result.success) {
        setWishlistItems(result.data);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch wishlist items" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      const result = await removeFromWishlist(token, wishlistItemId);
      
      if (result.success) {
        // Remove from local state
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistItemId));
        setMessage({ type: "success", text: "Item removed from wishlist" });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove item" });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const result = await addToCart(token, {
        productId,
        quantity: 1
      });
      
      if (result.success) {
        setMessage({ type: "success", text: "Item added to cart successfully!" });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add item to cart" });
    }
  };

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="wishlist-content">
          <div className="loading-spinner" style={{ textAlign: "center", padding: "50px" }}>
            <div>Loading wishlist...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content">
      <div className="wishlist-content">
        <h5 className="title">My Wishlist</h5>
        
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

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist" style={{ textAlign: "center", padding: "50px" }}>
            <div style={{ fontSize: "24px", marginBottom: "20px" }}>Your wishlist is empty</div>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Start adding products to your wishlist to see them here.
            </p>
            <Link href="/" className="tf-btn btn-fill">
              <span className="text text-button">Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="wishlist-items" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {wishlistItems.map((item) => {
              const product = item.productId;
              const price = product?.price || product?.sellingPrice || 0;

              return (
                <div key={item._id} className="wishlist-item" style={{ 
                  border: "1px solid #eee", 
                  borderRadius: "8px", 
                  padding: "20px",
                  backgroundColor: "white"
                }}>
                  <div className="product-image" style={{ 
                    width: "100%", 
                    height: "200px", 
                    marginBottom: "15px",
                    position: "relative"
                  }}>
                    <Image
                      src={product?.images?.[0]?.url || "/images/products/no-image.png"}
                      alt={product?.title || product?.name || "Product"}
                      fill
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </div>
                  
                  <div className="product-info">
                    <h6 style={{ 
                      margin: "0 0 10px 0", 
                      fontSize: "16px",
                      fontWeight: "600"
                    }}>
                      {product?.title || product?.name || "Product"}
                    </h6>
                    
                    <p style={{ 
                      margin: "0 0 15px 0", 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: "1.4"
                    }}>
                      {product?.description?.substring(0, 100)}...
                    </p>
                    
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      marginBottom: "15px"
                    }}>
                      <span style={{ 
                        fontSize: "18px", 
                        fontWeight: "bold", 
                        color: "#333" 
                      }}>
                        ${price.toFixed(2)}
                      </span>
                      
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          Add to Cart
                        </button>
                        
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/product-detail/${product._id}`}
                      style={{
                        display: "block",
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        color: "#333",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 