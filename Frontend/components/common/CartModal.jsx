"use client";
import React from "react";
import { useContextElement } from "../../context/Context";

export default function CartModal({ show, onClose }) {
  const { cartProducts } = useContextElement();

  if (!show) return null;

  if (!show) return null;

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ float: "right" }}>Close</button>
        <h3>Your Cart</h3>
        {!cartProducts || cartProducts.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartProducts.map((item, index) => (
              <li key={item.id || item._id || index} style={{ marginBottom: 12 }}>
                <b>{item.title || item.name || 'Product'}</b> <br />
                Size: {item.selectedSize || 'N/A'} <br />
                Color: {item.selectedColor || 'N/A'} <br />
                Quantity: {item.quantity || 1} <br />
                Price: ${item.price ? item.price.toFixed(2) : '0.00'} <br />
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