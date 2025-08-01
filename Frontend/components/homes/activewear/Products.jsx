"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { convertAndFormatUSDToINR } from "@/utils/currencyConverter";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [activeItem, setActiveItem] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch available categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/frontend/category/all');
        console.log("Categories API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Available categories:", data);
          
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            setActiveItem(data[0].name);
          } else {
            throw new Error("No categories found in database");
          }
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        const defaultCategories = ["Yoga", "Run", "Tennis", "Train", "Lounge", "Pilates"];
        setCategories(defaultCategories.map(name => ({ name })));
        setActiveItem(defaultCategories[0]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeItem) return;

    const fetchFilteredProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = `http://localhost:5000/api/frontend/category/filter?category=${encodeURIComponent(activeItem)}`;
        console.log("Fetching products from:", apiUrl);
        
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Filtered Products Response:", data);

        if (Array.isArray(data)) {
          setSelectedItems(data);
          console.log("Products found:", data.length);
        } else if (data.success && Array.isArray(data.data)) {
          setSelectedItems(data.data);
          console.log("Products found:", data.data.length);
        } else {
          console.error("API Error:", data.message || "Invalid response");
          setSelectedItems([]);
          setError(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setSelectedItems([]);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [activeItem]);

  const handleTabClick = (item) => {
    setActiveItem(item);
  };

  // Helper function to get image URL
  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.url) {
        if (image.url.startsWith('http')) {
          return image.url;
        }
        return `http://localhost:5000${image.url}`;
      }
      if (typeof image === 'string') {
        if (image.startsWith('http')) {
          return image;
        }
        return `http://localhost:5000${image}`;
      }
    }
    return null;
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (product) => {
    if (product.MRP && product.MRP > product.sellingPrice) {
      return Math.round(((product.MRP - product.sellingPrice) / product.MRP) * 100);
    }
    return 0;
  };

  // Helper function to create product slug
  const createProductSlug = (product) => {
    if (product.slug) {
      return product.slug;
    }
    // Create slug from title if no slug exists
    return product.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <section className="products-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h2 className="section-title">Today's Top Picks</h2>
        </div>

        {/* Category Navigation */}
        <div className="category-navigation">
          {categories.map((category, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(category.name)}
              className={`category-tab ${activeItem === category.name ? 'active' : ''}`}
              disabled={loading}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-container loading-state">
            <div className="loading-spinner"></div>
            <p className="state-message">Loading {activeItem} products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="state-container error-state">
            <p className="state-message error-message">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && selectedItems.length > 0 && (
          <div className={`products-grid ${selectedItems.length === 1 ? 'single-product' : selectedItems.length === 2 ? 'two-products' : selectedItems.length === 3 ? 'three-products' : 'multiple-products'}`}>
            {selectedItems.map((product, index) => {
              const imageUrl = getImageUrl(product);
              const discountPercentage = getDiscountPercentage(product);
              const productSlug = createProductSlug(product);
              
              return (
                <div key={product._id} className="product-card">
                  <Link href={`/product-detail/${productSlug}`} className="product-link">
                    <div className="product-image-wrapper">
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="discount-badge">
                          -{discountPercentage}%
                        </div>
                      )}
                      
                      {/* Product Image */}
                      <div className="product-image-container">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={product.title}
                            width={400}
                            height={400}
                            className="product-image"
                            priority={index < 4}
                          />
                        ) : (
                          <div className="image-placeholder">
                            <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Actions */}
                      <div className="product-actions">
                        <button 
                          className="action-btn wishlist-btn" 
                          title="Add to Wishlist"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add wishlist functionality here
                            console.log('Added to wishlist:', product._id);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                        <button 
                          className="action-btn compare-btn" 
                          title="Compare"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add compare functionality here
                            console.log('Added to compare:', product._id);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        </button>
                        <button 
                          className="action-btn quickview-btn" 
                          title="Quick View"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add quick view functionality here
                            console.log('Quick view:', product._id);
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="product-info">
                    <Link href={`/product-detail/${productSlug}`} className="product-info-link">
                      <h3 className="product-title">{product.title}</h3>
                      
                      <div className="product-pricing">
                        {product.MRP && product.MRP > product.sellingPrice && (
                          <span className="original-price">
                            {convertAndFormatUSDToINR(product.MRP)}
                          </span>
                        )}
                        <span className="current-price">
                          {convertAndFormatUSDToINR(product.sellingPrice)}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="product-footer">
                    <button 
                      className="add-to-cart-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart functionality here
                        console.log('Added to cart:', product._id);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && selectedItems.length === 0 && (
          <div className="state-container empty-state">
            <p className="state-message">No products found for {activeItem} category.</p>
            <p className="state-submessage">Try selecting a different category.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .products-section {
          padding: 60px 0;
          background-color: #ffffff;
          min-height: 80vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 300;
          color: #2d2d2d;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .category-navigation {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 60px;
          border-bottom: 1px solid #e8e8e8;
        }

        .category-tab {
          background: none;
          border: none;
          color: #999999;
          font-size: 16px;
          font-weight: 400;
          padding: 16px 24px;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }

        .category-tab:hover:not(:disabled) {
          color: #333333;
        }

        .category-tab.active {
          color: #333333;
          font-weight: 500;
        }

        .category-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background-color: #333333;
        }

        .category-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .products-grid {
          display: grid;
          gap: 30px;
          margin-bottom: 40px;
        }

        .products-grid.single-product {
          grid-template-columns: 1fr;
          max-width: 400px;
          margin: 0 auto 40px;
        }

        .products-grid.two-products {
          grid-template-columns: repeat(2, 1fr);
          max-width: 800px;
          margin: 0 auto 40px;
        }

        .products-grid.three-products {
          grid-template-columns: repeat(3, 1fr);
          max-width: 1200px;
          margin: 0 auto 40px;
        }

        .products-grid.multiple-products {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          max-width: 1400px;
          margin: 0 auto 40px;
        }

        .product-card {
          background: #ffffff;
          border-radius: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          border: 1px solid #f0f0f0;
        }

        .product-card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .product-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .product-info-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }

        .product-info-link:hover .product-title {
          color: #666666;
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .product-image-container {
          width: 100%;
          height: 400px;
          background-color: #f8f8f8;
          position: relative;
          overflow: hidden;
        }

        .product-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.08);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          width: 48px;
          height: 48px;
          color: #cccccc;
        }

        .discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background-color: #ff4757;
          color: white;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 0;
          z-index: 2;
          letter-spacing: 0.5px;
        }

        .product-actions {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s ease;
          z-index: 2;
        }

        .product-card:hover .product-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .action-btn {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666666;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: #333333;
          color: white;
          border-color: #333333;
          transform: scale(1.1);
        }

        .product-info {
          padding: 20px;
          text-align: center;
        }

        .product-title {
          font-size: 16px;
          font-weight: 400;
          color: #333333;
          margin: 0 0 12px 0;
          line-height: 1.4;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.3px;
        }

        .product-pricing {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 0;
        }

        .original-price {
          font-size: 14px;
          color: #999999;
          text-decoration: line-through;
          font-weight: 300;
        }

        .current-price {
          font-size: 18px;
          font-weight: 600;
          color: #333333;
        }

        .product-footer {
          padding: 0 20px 20px;
        }

        .add-to-cart-btn {
          width: 100%;
          background: transparent;
          border: 2px solid #333333;
          color: #333333;
          font-size: 12px;
          font-weight: 600;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .add-to-cart-btn:hover {
          background: #333333;
          color: white;
        }

        .state-container {
          text-align: center;
          padding: 80px 20px;
        }

        .loading-state {
          background: transparent;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid #f0f0f0;
          border-top: 2px solid #333333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .state-message {
          font-size: 16px;
          color: #666666;
          margin: 0;
          font-weight: 400;
        }

        .error-message {
          color: #ff4757;
        }

        .state-submessage {
          font-size: 14px;
          color: #999999;
          margin: 8px 0 0 0;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .products-grid.multiple-products {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 15px;
          }

          .section-title {
            font-size: 36px;
          }

          .category-navigation {
            flex-wrap: wrap;
            gap: 0;
            justify-content: center;
          }

          .category-tab {
            font-size: 14px;
            padding: 14px 16px;
          }

          .products-grid.single-product,
          .products-grid.two-products,
          .products-grid.three-products,
          .products-grid.multiple-products {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .product-image-container {
            height: 320px;
          }

          .product-actions {
            opacity: 1;
            transform: none;
            flex-direction: row;
            justify-content: center;
            padding: 15px;
            background: rgba(255,255,255,0.95);
            position: absolute;
            bottom: 15px;
            left: 15px;
            right: 15px;
            border-radius: 8px;
          }
        }

        @media (max-width: 480px) {
          .products-section {
            padding: 40px 0;
          }

          .section-title {
            font-size: 28px;
          }

          .products-grid.single-product,
          .products-grid.two-products,
          .products-grid.three-products,
          .products-grid.multiple-products {
            grid-template-columns: 1fr;
          }

          .category-tab {
            font-size: 13px;
            padding: 12px 14px;
          }

          .product-image-container {
            height: 280px;
          }
        }
      `}</style>
    </section>
  );
}