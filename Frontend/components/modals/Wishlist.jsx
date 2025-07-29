"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function Wishlist() {
  const { wishlistItems, loading, removeFromWishlist, fetchWishlist } = useWishlist();

  // Transform wishlist items to match the expected format
  const transformedItems = wishlistItems.map((item) => {
    const product = item.productId;
    return {
      ...product,
      id: product?._id || item._id, // Use product _id or wishlist item _id
      wishlistItemId: item._id, // Keep the wishlist item ID for removal
      title: product?.title || "Product",
      imgSrc: product?.images?.[0]?.url || "/images/products/no-image.png",
      price: product?.sellingPrice || 0,
    };
  });
  return (
    <div className="modal fullRight fade modal-wishlist" id="wishlist">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="header">
            <h5 className="title">Your Wishlist</h5>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              onClick={fetchWishlist}
            />
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-sroll">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <div>Loading wishlist...</div>
                    </div>
                  ) : transformedItems.length ? (
                    <div className="tf-mini-cart-items">
                      {transformedItems.map((elm, i) => (
                        <div key={i} className="tf-mini-cart-item file-delete">
                          <div className="tf-mini-cart-image">
                            <Image
                              className="lazyload"
                              alt=""
                              src={elm.imgSrc}
                              width={600}
                              height={800}
                            />
                          </div>
                          <div className="tf-mini-cart-info flex-grow-1">
                            <div className="mb_12 d-flex align-items-center justify-content-between flex-wrap gap-12">
                              <div className="text-title">
                                <Link
                                  href={`/product-detail/${elm.id}`}
                                  className="link text-line-clamp-1"
                                >
                                  {elm.title}
                                </Link>
                              </div>
                              <div
                                className="text-button tf-btn-remove remove"
                                onClick={() => removeFromWishlist(elm.wishlistItemId)}
                              >
                                Remove
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-12">
                              <div className="text-secondary-2">XL/Blue</div>
                              <div className="text-button">
                                ${elm.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <h6>Your wishlist is empty</h6>
                      <p>Add some products to your wishlist</p>
                      <Link className="btn-line" href="/shop-left-sidebar">
                        Explore Products
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="tf-mini-cart-bottom">
                <Link
                  href={`/wish-list`}
                  className="btn-style-2 w-100 radius-4 view-all-wishlist"
                >
                  <span className="text-btn-uppercase">View All Wish List</span>
                </Link>
                <Link
                  href={`/shop-default-grid`}
                  className="text-btn-uppercase"
                >
                  Or continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
