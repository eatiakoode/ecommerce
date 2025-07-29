"use client";
import React, { useState } from "react";
import { useContextElement } from "@/context/Context";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import Slider1 from "../sliders/Slider1";

// Helper function to format INR prices
const formatINRPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0';
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function Details1({ product }) {
  const [activeColor, setActiveColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const { addToWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
  } = useContextElement();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert("Please login to add items to cart");
      return;
    }

    setCartLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const productId = product._id || product.id;
      if (productId) {
        addProductToCart(productId, quantity);
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart: " + error.message);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    const productId = product._id || product.id;
    if (productId) {
      await addToWishlist(productId);
    }
  };

  // Get the correct price values (already in INR from backend)
  const sellingPrice = product.sellingPrice || product.price || 0;
  const mrp = product.MRP || product.oldPrice || 0;
  const hasDiscount = mrp > sellingPrice;

  // Sample colors and sizes for demonstration
  const colors = [
    { name: "Gray", bgColor: "#8B8B8B", selected: true },
    { name: "Black", bgColor: "#000000", selected: false },
    { name: "Light Gray", bgColor: "#D3D3D3", selected: false }
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <section className="flat-spacing">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product default */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <Slider1
                  setActiveColor={setActiveColor}
                  activeColor={activeColor}
                  firstItem={product.imgSrc}
                  productImages={product.images}
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative mw-100p-hidden">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      <div className="text text-btn-uppercase" style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
                        CLOTHING
                      </div>
                      <h3 className="name" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
                        {product.title || "AirFlex High-Waist Yoga Leggings"}
                      </h3>
                      <div className="sub" style={{ marginBottom: '20px' }}>
                        <div className="tf-product-info-rate" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <div className="list-star" style={{ marginRight: '8px' }}>
                            <i className="icon icon-star" style={{ color: '#000', marginRight: '2px' }} />
                            <i className="icon icon-star" style={{ color: '#000', marginRight: '2px' }} />
                            <i className="icon icon-star" style={{ color: '#000', marginRight: '2px' }} />
                            <i className="icon icon-star" style={{ color: '#000', marginRight: '2px' }} />
                            <i className="icon icon-star" style={{ color: '#000', marginRight: '2px' }} />
                          </div>
                          <div className="text text-caption-1" style={{ color: '#666', fontSize: '14px' }}>
                            (134 reviews)
                          </div>
                        </div>
                        <div className="tf-product-info-sold" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="icon icon-lightning" style={{ color: '#666', marginRight: '4px' }} />
                          <div className="text text-caption-1" style={{ color: '#666', fontSize: '14px' }}>
                            18 sold in last 32 hours
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tf-product-info-desc">
                      <div className="tf-product-info-price" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '28px', fontWeight: 'bold', color: '#000', margin: '0 12px 0 0' }}>
                            {formatINRPrice(sellingPrice)}
                          </h4>
                          {hasDiscount && (
                            <>
                              <span style={{ color: '#666', textDecoration: 'line-through', marginRight: '8px' }}>
                                {formatINRPrice(mrp)}
                              </span>
                              <span style={{ 
                                backgroundColor: '#ff0000', 
                                color: '#fff', 
                                padding: '4px 8px', 
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}>
                                -{Math.round(((mrp - sellingPrice) / mrp) * 100)}%
                              </span>
                            </>
                          )}
                        </div>
                        <p style={{ color: '#333', fontSize: '14px', lineHeight: '1.5', margin: '0' }}>
                          These leggings are crafted from sweat-wicking, 4-way stretch fabric designed to move with your body. Featuring a supportive waistband and smooth seams, they're perfect for yoga, stretching, or lounging.
                        </p>
                      </div>
                      
                      {/* Live Viewing Indicator */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                        <i className="icon icon-eye" style={{ marginRight: '6px' }} />
                        28 people are viewing this right now
                      </div>
                    </div>
                  </div>
                  
                  <div className="tf-product-info-options">
                    {/* Color Selection */}
                    <div className="tf-product-info-option" style={{ marginBottom: '20px' }}>
                      <div className="tf-product-info-option-heading" style={{ marginBottom: '8px' }}>
                        <h6 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', margin: '0' }}>
                          Colors: Gray
                        </h6>
                      </div>
                      <div className="tf-product-info-option-content">
                        <div className="tf-product-info-option-list" style={{ display: 'flex', gap: '8px' }}>
                          {colors.map((color, index) => (
                            <button
                              key={index}
                              className="tf-product-info-option-item"
                              onClick={() => setActiveColor(index)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: color.selected ? '2px solid #000' : '1px solid #ddd',
                                borderRadius: '50%',
                                padding: '8px',
                                background: 'transparent',
                                cursor: 'pointer'
                              }}
                            >
                              <span
                                className="tf-product-info-option-item-color"
                                style={{ 
                                  backgroundColor: color.bgColor,
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  display: 'block'
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="tf-product-info-option" style={{ marginBottom: '20px' }}>
                      <div className="tf-product-info-option-heading" style={{ marginBottom: '8px' }}>
                        <h6 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', margin: '0' }}>
                          selected size: L
                        </h6>
                      </div>
                      <div className="tf-product-info-option-content">
                        <div className="tf-product-info-option-list" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {sizes.map((size, index) => (
                            <button
                              key={index}
                              className="tf-product-info-option-item"
                              onClick={() => setSelectedSize(size)}
                              style={{
                                border: selectedSize === size ? '1px solid #000' : '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                background: selectedSize === size ? '#000' : 'transparent',
                                color: selectedSize === size ? '#fff' : '#000',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: selectedSize === size ? 'bold' : 'normal'
                              }}
                            >
                              {size}
                            </button>
                          ))}
                          <span style={{ color: '#666', fontSize: '12px', marginLeft: '12px' }}>
                            Size Guide
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="tf-product-info-option" style={{ marginBottom: '20px' }}>
                      <div className="tf-product-info-option-heading" style={{ marginBottom: '8px' }}>
                        <h6 style={{ fontSize: '14px', fontWeight: 'bold', color: '#000', margin: '0' }}>
                          Quantity:
                        </h6>
                      </div>
                      <div className="tf-product-info-option-content">
                        <div className="tf-product-info-option-quantity" style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          width: 'fit-content'
                        }}>
                          <button
                            className="tf-product-info-option-quantity-btn"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="tf-product-info-option-quantity-input"
                            style={{
                              border: 'none',
                              textAlign: 'center',
                              width: '60px',
                              padding: '8px',
                              fontSize: '14px'
                            }}
                          />
                          <button
                            className="tf-product-info-option-quantity-btn"
                            onClick={() => setQuantity(quantity + 1)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '16px'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="tf-product-info-actions">
                    <div className="tf-product-info-actions-main" style={{ marginBottom: '12px' }}>
                      <button
                        onClick={handleAddToCart}
                        className="tf-btn tf-btn-primary"
                        disabled={cartLoading}
                        style={{
                          width: '100%',
                          backgroundColor: '#000',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '12px 24px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: cartLoading ? "not-allowed" : "pointer",
                          opacity: cartLoading ? 0.6 : 1,
                          marginBottom: '8px'
                        }}
                      >
                        {cartLoading ? "Adding..." : `ADD TO CART - ${formatINRPrice(sellingPrice)}`}
                      </button>
                    </div>
                    
                    <div className="tf-product-info-actions-secondary" style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <button
                        onClick={() => addToCompareItem(product._id || product.id)}
                        className="box-icon hover-tooltip text-caption-2 compare btn-icon-action"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '8px'
                        }}
                      >
                        <i className="icon icon-compare" style={{ fontSize: '18px' }} />
                      </button>
                      <button
                        onClick={handleAddToWishlist}
                        className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                        disabled={wishlistLoading}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: wishlistLoading ? "not-allowed" : "pointer",
                          opacity: wishlistLoading ? 0.6 : 1,
                          padding: '8px'
                        }}
                      >
                        <i className="icon icon-heart" style={{ fontSize: '18px' }} />
                      </button>
                    </div>

                    {/* Buy It Now Button */}
                    <button
                      style={{
                        width: '100%',
                        backgroundColor: '#ff0000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '20px'
                      }}
                    >
                      BUY IT NOW
                    </button>

                    {/* Additional Information */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px' }}>
                          <i className="icon icon-truck" style={{ marginRight: '4px' }} />
                          Delivery & Return
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px' }}>
                          <i className="icon icon-question" style={{ marginRight: '4px' }} />
                          Ask a Question
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px' }}>
                          <i className="icon icon-share" style={{ marginRight: '4px' }} />
                          Share
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                        <div style={{ marginBottom: '4px' }}>
                          <i className="icon icon-clock" style={{ marginRight: '4px' }} />
                          Estimated Delivery: 12-26 days(International), 3-6 days (United States)
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <i className="icon icon-refresh" style={{ marginRight: '4px' }} />
                          Return within 45 days of purchase. Duties & taxes are non-refundable.
                        </div>
                        <div>
                          <i className="icon icon-location" style={{ marginRight: '4px' }} />
                          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            View Store Information
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SKU */}
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      SKU: AIRFLEXHIG1784
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
    </section>
  );
}