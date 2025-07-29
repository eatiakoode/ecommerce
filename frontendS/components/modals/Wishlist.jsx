"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function Wishlist() {
  const { wishlistItems, loading, removeFromWishlist, fetchWishlist } = useWishlist();

  // Transform wishlist items to match the expected format
  const transformedItems = wishlistItems.map((item) => {
    // Check if productId is populated (has the full product object)
    const product = item.productId;
    
    return {
      id: product?._id || item._id, // Use product _id or wishlist item _id
      wishlistItemId: item._id, // Keep the wishlist item ID for removal
      title: product?.title || "Product",
      price: product?.sellingPrice || 0,
      imgSrc: product?.images?.[0]?.url ? 
        `http://localhost:5000${product.images[0].url}` : 
        "/images/products/womens/women-1.jpg", // fallback image
    };
  });

  return (
    <div className="modal fullRight fade modal-wishlist" id="wishlist">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <h5 className="title">Your Wishlist</h5>
            <div className="d-flex align-items-center gap-2">
              <button 
                onClick={fetchWishlist}
                className="btn btn-sm btn-outline-secondary"
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                Refresh
              </button>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-main">
              <div className="tf-mini-cart-sroll">
                {loading ? (
                  <div className="p-4 text-center">
                    <div>Loading wishlist...</div>
                  </div>
                ) : transformedItems.length ? (
                  <div className="tf-mini-cart-items">
                    {transformedItems.map((elm, i) => (
                      <div className="tf-mini-cart-item" key={i}>
                        <div className="image">
                          <Image
                            src={elm.imgSrc}
                            alt={elm.title}
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className="content">
                          <h6>
                            <Link href={`/product-detail/${elm.id}`}>
                              {elm.title}
                            </Link>
                          </h6>
                          <div className="price">
                            <span className="price-amount">₹{elm.price}</span>
                          </div>
                        </div>
                        <div className="remove">
                          <button
                            onClick={() => removeFromWishlist(elm.wishlistItemId)}
                            className="icon-close"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="tf-mini-cart-empty">
                    <div className="icon">
                      <i className="icon-heart" />
                    </div>
                    <h6>Your wishlist is empty</h6>
                    <p>Add some products to your wishlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
