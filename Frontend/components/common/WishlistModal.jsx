"use client";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function WishlistModal({ show, onClose }) {
  const { wishlistItems, loading } = useWishlist();
  const router = useRouter();

  const handleViewCart = () => {
    onClose(); // Close the modal first
    router.push('/my-account-wishlist'); // Navigate to cart page
  };

  if (!show) return null;

  return (
    <div className="cart-modal-backdrop" onClick={onClose}>
      <div className="cart-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose} className="close-btn">Close</button>
          <button onClick={handleViewCart} className="view-cart-btn">View Wishlist</button>
        </div>
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
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .close-btn, .view-cart-btn {
          background: #000;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        .close-btn:hover, .view-cart-btn:hover {
          background: #333;
        }
        .view-cart-btn {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}