"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utlis/currency";

export default function ProductCard1({
  product,
  gridClass = "",
  parentClass = "card-product wow fadeInUp",
  isNotImageRatio = false,
  radiusClass = "",
}) {
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState('/images/products/product-1.jpg');

  const getSafeImageSrc = (src) => {
    // Handle null, undefined, or empty string
    if (!src || src === '' || src === 'null' || src === 'undefined') {
      return '/images/products/product-1.jpg';
    }
    
    // If it's already a full URL, return as is
    if (src.startsWith('http')) return src;
    
    // If it starts with /uploads/, it's from backend - prepend backend URL
    if (src.startsWith('/uploads/')) {
      return `http://localhost:5000${src}`;
    }
    
    // If it starts with upload-, it's from backend uploads - use proxy
    if (src.startsWith('upload-')) {
      return `http://localhost:5000/uploads/${src}`;
    }
    
    // If it starts with /, it's a relative path
    if (src.startsWith('/')) return src;
    
    // Default case - treat as relative path
    return `/${src}`;
  };

  // Get the initial image source from backend data
  const getInitialImageSrc = () => {
    // Check if product has images array from backend
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }
    
    // Fallback to old structure
    if (product.imgSrc) {
      return product.imgSrc;
    }
    
    // Final fallback
    return '/images/products/product-1.jpg';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && product) {
      const imageSrc = getSafeImageSrc(getInitialImageSrc());
      setCurrentImage(imageSrc);
    }
  }, [mounted, product]);

  const { addToWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const {
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  // Calculate discount percentage
  const calculateDiscount = () => {
    const currentPrice = product.sellingPrice || product.price;
    if (product.MRP && currentPrice && product.MRP > currentPrice) {
      const discount = Math.round(((product.MRP - currentPrice) / product.MRP) * 100);
      return discount > 0 ? discount : 0;
    }
    return 0;
  };

  const discount = calculateDiscount();

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className={`${parentClass} ${gridClass}`}>
        <div className={`card-product-wrapper ${isNotImageRatio ? "aspect-ratio-0" : ""} ${radiusClass}`}>
          <div className="product-img test">
            <div style={{ width: 300, height: 300, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Log product data
  console.log('ProductCard1 - Product data:', {
    id: product.id,
    title: product.title,
    price: product.price,
    sellingPrice: product.sellingPrice,
    MRP: product.MRP,
    slug: product.slug,
    shortDescription: product.shortDescription
  });

  return (
    <div
      className={`${parentClass} ${gridClass} ${
        product.MRP && product.MRP > (product.sellingPrice || product.price) ? "on-sale" : ""
      } ${product.MRP && product.MRP > (product.sellingPrice || product.price) ? "card-product-size" : ""}`}
    >
      <div
        className={`card-product-wrapper ${
          isNotImageRatio ? "aspect-ratio-0" : ""
        } ${radiusClass} `}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="on-sale-wrap" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
            <span className="on-sale" style={{ 
              backgroundColor: '#dc3545', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '12px', 
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              -{discount}%
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link href={`/product-detail/${product.slug || product.id || product._id}`} className="product-img test">
          <img
            src={currentImage || '/images/products/product-1.jpg'}
            alt={product.title || product.name || 'Product Image'}
            className="img-fluid"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              minHeight: '200px'
            }}
            onError={(e) => {
              console.log('Image failed to load:', currentImage);
              e.target.src = '/images/products/product-1.jpg';
            }}
          />
        </Link>

        {/* Hover Icons */}
        <div className="list-product-btn" style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          opacity: 1,
          pointerEvents: 'auto'
        }}>
          <div className="list-btn-main">
            <button
              className="list-btn"
              onClick={() => addToWishlist(product.id || product._id)}
              title="Add to Wishlist"
              disabled={wishlistLoading}
              suppressHydrationWarning
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                opacity: wishlistLoading ? 0.6 : 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                zIndex: 25
              }}
            >
              <i className={`icon ${isInWishlist(product.id || product._id) ? "icon-heart-fill" : "icon-heart"}`} style={{ color: isInWishlist(product.id || product._id) ? '#dc3545' : '#333', fontSize: '14px' }} />
            </button>
            <button
              className="list-btn"
              onClick={() => addToCompareItem(product.id || product._id)}
              title="Add to Compare"
              suppressHydrationWarning
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                zIndex: 25
              }}
            >
              <i className={`icon ${isAddedtoCompareItem(product.id || product._id) ? "icon-refresh-fill" : "icon-refresh"}`} style={{ color: isAddedtoCompareItem(product.id || product._id) ? '#007bff' : '#333', fontSize: '14px' }} />
            </button>
            <button
              className="list-btn"
              onClick={() => setQuickViewItem(product)}
              title="Quick View"
              suppressHydrationWarning
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                zIndex: 25
              }}
            >
              <i className="icon icon-eye" style={{ color: '#333', fontSize: '14px' }} />
            </button>
          </div>
          </div>

        {/* Product Info */}
        <div className="card-product-info" style={{ 
          padding: '15px', 
          backgroundColor: 'white',
          borderTop: '1px solid #f0f0f0',
          position: 'relative',
          zIndex: 10,
          marginTop: '10px'
        }}>
          <Link href={`/product-detail/${product.slug || product.id || product._id}`} className="title link">
            <h5 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '8px',
              lineHeight: '1.3',
              textDecoration: 'none'
            }}>
              {product.title || product.name || 'Product Title'}
            </h5>
          </Link>
          
          <div className="price" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="old-price" style={{ 
                color: '#999', 
                textDecoration: 'line-through', 
                fontSize: '14px' 
              }}>
                ₹{product.oldPrice}
              </span>
            )}
            <span className="current-price" style={{ 
              color: '#007bff', 
              fontSize: '18px', 
              fontWeight: 'bold' 
            }}>
              ₹{product.price || 0}
            </span>
            {!product.price && (
              <span className="no-price" style={{ 
                color: '#999', 
                fontSize: '14px' 
              }}>
                Price not available
              </span>
            )}
          </div>
          
          {/* Short Description */}
          {product.shortDescription && (
            <p style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '0px',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
