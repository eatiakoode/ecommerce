"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getCart, updateCartItem, removeFromCart } from "@/api/auth";

export default function CartContent() {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const result = await getCart(token);
      
      if (result.success) {
        setCartItems(result.data);
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch cart items" });
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const result = await updateCartItem(token, cartItemId, newQuantity);
      
      if (result.success) {
        // Update local state
        setCartItems(prev => 
          prev.map(item => 
            item._id === cartItemId 
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update quantity" });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const result = await removeFromCart(token, cartItemId);
      
      if (result.success) {
        // Remove from local state
        setCartItems(prev => prev.filter(item => item._id !== cartItemId));
        setMessage({ type: "success", text: "Item removed from cart" });
      } else {
        setMessage({ type: "error", text: result.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove item" });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.productId?.sellingPrice || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 10 : 0; // Free shipping over $50
    return subtotal + shipping;
  };

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="cart-content">
          <div className="loading-spinner" style={{ textAlign: "center", padding: "50px" }}>
            <div>Loading cart...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content">
      <div className="cart-content">
        <h5 className="title">Shopping Cart</h5>
        
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

        {cartItems.length === 0 ? (
          <div className="empty-cart" style={{ textAlign: "center", padding: "50px" }}>
            <div style={{ fontSize: "24px", marginBottom: "20px" }}>Your cart is empty</div>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/" className="tf-btn btn-fill">
              <span className="text text-button">Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="cart-items">
            <div className="cart-header" style={{ 
              display: "grid", 
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", 
              gap: "20px",
              padding: "15px 0",
              borderBottom: "1px solid #eee",
              fontWeight: "bold"
            }}>
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
              <div>Action</div>
            </div>

            {cartItems.map((item) => {
              const product = item.productId;
              const price = product?.price || product?.sellingPrice || 0;
              const total = price * item.quantity;

              return (
                <div key={item._id} className="cart-item" style={{ 
                  display: "grid", 
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", 
                  gap: "20px",
                  padding: "20px 0",
                  borderBottom: "1px solid #eee",
                  alignItems: "center"
                }}>
                  <div className="product-info" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div className="product-image" style={{ width: "80px", height: "80px" }}>
                      <Image
                        src={product?.images?.[0]?.url || "/images/products/no-image.png"}
                        alt={product?.title || product?.name || "Product"}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </div>
                    <div className="product-details">
                      <h6 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                        {product?.title || product?.name || "Product"}
                      </h6>
                      {item.color && (
                        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                          Color: {item.color.name}
                        </p>
                      )}
                      {item.size && (
                        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                          Size: {item.size.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="price">
                    ${price.toFixed(2)}
                  </div>

                  <div className="quantity">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "1px solid #ddd",
                          background: "white",
                          cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                          opacity: item.quantity <= 1 ? 0.5 : 1
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "40px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        style={{
                          width: "30px",
                          height: "30px",
                          border: "1px solid #ddd",
                          background: "white",
                          cursor: "pointer"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="total">
                    ${total.toFixed(2)}
                  </div>

                  <div className="action">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc3545",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="cart-summary" style={{ 
              marginTop: "30px", 
              padding: "20px", 
              backgroundColor: "#f8f9fa", 
              borderRadius: "8px" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Shipping:</span>
                <span>{calculateSubtotal() > 0 ? "$10.00" : "Free"}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "20px", 
                paddingTop: "20px", 
                borderTop: "1px solid #ddd",
                fontWeight: "bold",
                fontSize: "18px"
              }}>
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              
              <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
                <Link href="/checkout" className="tf-btn btn-fill" style={{ flex: 1 }}>
                  <span className="text text-button">Proceed to Checkout</span>
                </Link>
                <Link href="/" className="tf-btn btn-outline" style={{ flex: 1 }}>
                  <span className="text text-button">Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 