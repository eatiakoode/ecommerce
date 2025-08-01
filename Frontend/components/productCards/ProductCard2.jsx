"use client";
import { products3 } from "@/data/products";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
export default function ProductCard2({
  product = products3[0],
  addedClass = "",
}) {
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
      className={`card-product bundle-hover-item  ${addedClass} wow fadeInUp`}
      data-wow-delay={product.wowDelay}
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.slug || product.id || product._id || 'product'}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={currentImage}
            src={currentImage}
            alt={product.title || product.name || 'Product Image'}
            width={351}
            height={468}
            onError={(e) => {
      
              e.target.src = '/images/products/womens/women-1.jpg';
            }}
          />
          {product.imgHover && (
            <Image
              className="lazyload img-hover"
              data-src={getSafeImageSrc(product.imgHover)}
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
        <div className="on-sale-wrap">
          <span className="on-sale-item">{product.saleText || 'Sale'}</span>
        </div>
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
        <Link href={`/product-detail/${product.slug || product.id || product._id || 'product'}`} className="title link">
          {product.title || product.name || 'Product Title'}
        </Link>
        <span className="price">
          <span className="old-price">₹{product.oldPrice?.toFixed(2) || '0.00'}</span>₹
          {product.price?.toFixed(2) || '0.00'}
        </span>
        {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color, idx) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                }  ${color.bgColor == "bg-white" ? "line" : ""}`}
                onMouseOver={() => setCurrentImage(getSafeImageSrc(color.imgSrc))}
                key={idx}
              >
                <span className={`swatch-value ${color.bgColor}`} />
                <Image
                  className="lazyload"
                  data-src={getSafeImageSrc(color.imgSrc)}
                  src={getSafeImageSrc(color.imgSrc)}
                  alt="image-product"
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
      </div>
    </div>
  );
}
