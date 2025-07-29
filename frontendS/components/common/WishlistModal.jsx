"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistModal({ show, onClose }) {
  const { wishlistItems, loading } = useWishlist();

  if (!show) return null;

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ float: "right" }}>Close</button>
        <h3>Your Wishlist</h3>
        {loading ? (
          <p>Loading...</p>
        ) : wishlistItems.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <ul>
            {wishlistItems.map((item) => {
              const product = item.productId;
              return (
                <li key={item._id} style={{ marginBottom: 12 }}>
                  <b>{product?.title || "Product"}</b> <br />
                  Price: ₹{product?.sellingPrice || 0} <br />
                </li>
              );
            })}
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