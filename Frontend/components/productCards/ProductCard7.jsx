"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
export default function ProductCard7({ product, gridClass = "" }) {
  const [currentImage, setCurrentImage] = useState('/images/products/womens/women-1.jpg');

  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  // Safe image src handling
  const getSafeImageSrc = (src) => {
    if (!src || src === '' || src === 'null' || src === 'undefined') {
      return '/images/products/womens/women-1.jpg';
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
    return '/images/products/womens/women-1.jpg';
  };

  useEffect(() => {
    const imageSrc = getSafeImageSrc(getInitialImageSrc());
    setCurrentImage(imageSrc);
  }, [product]);

  return (
    <div
      className={`card-product style-2 ${gridClass} ${
        product.isOnSale ? "on-sale" : ""
      } ${product.sizes ? "card-product-size" : ""}`}
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={currentImage}
            alt={product.title || 'Product Image'}
            width={600}
            height={800}
            onError={(e) => {
      
              e.target.src = '/images/products/womens/women-1.jpg';
            }}
          />

          {product.imgHover && (
            <Image
              className="lazyload img-hover"
              src={getSafeImageSrc(product.imgHover)}
              alt={product.title || 'Product Image'}
              width={600}
              height={800}
              onError={(e) => {
        
                e.target.src = '/images/products/womens/women-1.jpg';
              }}
            />
          )}
        </Link>
        {product.hotSale && (
          <div className="marquee-product bg-main">
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
            <div className="marquee-wrapper">
              <div className="initial-child-container">
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
                <div className="marquee-child-item">
                  <p className="font-2 text-btn-uppercase fw-6 text-white">
                    Hot Sale 25% OFF
                  </p>
                </div>
                <div className="marquee-child-item">
                  <span className="icon icon-lightning text-critical" />
                </div>
              </div>
            </div>
          </div>
        )}
        {product.isOnSale && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">-25%</span>
          </div>
        )}
        {product.countdown && (
          <div className="countdown-wrap">
            <CountdownTimer endDate={product.countdown} />
          </div>
        )}
        <div className="list-btn-main">
          <a
            href="#quickView"
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            className="btn-main-product"
          >
            Quick View
          </a>
        </div>
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price current-price">
          {product.oldPrice && (
            <span className="old-price">₹{product.oldPrice?.toFixed(2) || '0.00'}</span>
          )}{" "}
          ₹{product.price?.toFixed(2) || '0.00'}
        </span>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, index) => (
              <li
                key={index}
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                onMouseOver={() => setCurrentImage(getSafeImageSrc(color.imgSrc))}
              >
                <span className={`swatch-value ${color.bgColor}`} />
                <Image
                  className="lazyload"
                  src={getSafeImageSrc(color.imgSrc)}
                  alt="color variant"
                  width={600}
                  height={800}
                  onError={(e) => {
            
                    e.target.src = '/images/products/womens/women-1.jpg';
                  }}
                />
              </li>
            ))}
          </ul>
        )}
        {product.sizes && (
          <div className="size-box">
            {product.sizes.map((size, index) => (
              <span
                key={index}
                className={`size-item box-icon ${
                  size.isAvailable ? "" : "disable"
                }`}
              >
                {size.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="card-product-actions">
        <div className="card-product-actions-top">
          <button
            onClick={() => addToWishlist(product.id)}
            className="box-icon wishlist btn-icon-action"
          >
            <i className="icon icon-heart" />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Wishlist"}
            </span>
          </button>
          <button
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare btn-icon-action"
          >
            <i className="icon icon-compare" />
            <span className="tooltip">
              {isAddedtoCompareItem(product.id)
                ? "Already Compare"
                : "Compare"}
            </span>
          </button>
          <button
            onClick={() => setQuickViewItem(product)}
            data-bs-toggle="modal"
            data-bs-target="#quickView"
            className="box-icon quick-view btn-icon-action"
          >
            <i className="icon icon-eye" />
            <span className="tooltip">Quick View</span>
          </button>
        </div>
        <div className="card-product-actions-bottom">
          <button
            onClick={() => addProductToCart(product.id)}
            className="box-icon cart btn-icon-action"
          >
            <i className="icon icon-cart" />
            <span className="tooltip">
              {isAddedToCartProducts(product.id)
                ? "Already Cart"
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
