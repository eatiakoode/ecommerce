"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";

import { useContextElement } from "@/context/Context";
export default function ProductsCards6({ product }) {
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
      className="card-product style-list"
      data-availability="In stock"
      data-brand="gucci"
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.slug || product.id || product._id || 'product'}`} className="product-img">
          <Image
            className="lazyload img-product"
            src={currentImage}
            alt={product.title || product.name || 'Product Image'}
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
              alt={product.title || product.name || 'Product Image'}
              width={600}
              height={800}
              onError={(e) => {
        
                e.target.src = '/images/products/womens/women-1.jpg';
              }}
            />
          )}
        </Link>
        {product.isOnSale && (
          <div className="on-sale-wrap">
            <span className="on-sale-item">{product.saleText || '-25%'}</span>
          </div>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.slug || product.id || product._id || 'product'}`} className="title link">
          {product.title || product.name || 'Product Title'}
        </Link>
        <span className="price current-price">
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="old-price">₹{product.oldPrice?.toFixed(2) || '0.00'}</span>
          )}{" "}
          ₹{product.price?.toFixed(2) || '0.00'}
        </span>
        <p className="description text-secondary text-line-clamp-2">
          {product.shortDescription || product.description || 'The garments labelled as Committed are products that have been produced using sustainable fibres or processes, reducing their environmental impact.'}
        </p>
        <div className="variant-wrap-list">
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
            <div className="size-box list-product-btn">
              <span className="size-item box-icon">S</span>
              <span className="size-item box-icon">M</span>
              <span className="size-item box-icon">L</span>
              <span className="size-item box-icon">XL</span>
              <span className="size-item box-icon disable">XXL</span>
            </div>
          )}
          <div className="list-product-btn">
            <a
              onClick={() => addProductToCart(product.id)}
              className="btn-main-product"
            >
              {isAddedToCartProducts(product.id)
                ? "Already Added"
                : "Add To cart"}
            </a>
            <a
              onClick={() => addToWishlist(product.id)}
              className="box-icon wishlist btn-icon-action"
            >
              <span className="icon icon-heart" />
              <span className="tooltip">
                {isAddedtoWishlist(product.id)
                  ? "Already Wishlished"
                  : "Wishlist"}
              </span>
            </a>
            <a
              href="#compare"
              data-bs-toggle="offcanvas"
              aria-controls="compare"
              onClick={() => addToCompareItem(product.id)}
              className="box-icon compare btn-icon-action"
            >
              <span className="icon icon-gitDiff" />
              <span className="tooltip">
                {" "}
                {isAddedtoCompareItem(product.id)
                  ? "Already compared"
                  : "Compare"}
              </span>
            </a>
            <a
              href="#quickView"
              onClick={() => setQuickViewItem(product)}
              data-bs-toggle="modal"
              className="box-icon quickview tf-btn-loading"
            >
              <span className="icon icon-eye" />
              <span className="tooltip">Quick View</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
