"use client";
import React, { useEffect, useState } from "react";

export default function CartModal({ show, onClose }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      setLoading(true);
      fetch("/api/user/cart", {
        credentials: "include", // if using cookies for auth
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Cart API response:", data); // <--- Add this
          // Always set cart as an array
          setCart(Array.isArray(data) ? data : data.cart || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ float: "right" }}>Close</button>
        <h3>Your Cart</h3>
        {loading ? (
          <p>Loading...</p>
        ) : !cart || cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item._id} style={{ marginBottom: 12 }}>
                <b>{item.productId.title}</b> <br />
                Size: {item.size?.name} <br />
                Color: {item.color?.title} <br />
                Quantity: {item.quantity} <br />
                Price: ₹{item.productId.sellingPrice} <br />
              </li>
            ))}
          </ul>
        )}
      </div>
      <style jsx>{`
        .cart-modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .cart-modal {
          background: #fff; padding: 24px; border-radius: 8px; min-width: 320px; max-width: 90vw;
        }
      `}</style>
    </div>
  );
}