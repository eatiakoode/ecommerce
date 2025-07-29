"use client";
import { products3 } from "@/data/products";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard1({
  product = products3[0],
  addedClass = "",
}) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const { addToWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();

  const {
    addToCompareItem,
    isAddedtoCompareItem,
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  const handleAddToWishlist = async () => {
    const productId = product._id || product.id;
    if (productId) {
      await addToWishlist(productId);
    }
  };

  return (
    <div
      className={`card-product bundle-hover-item  ${addedClass} wow fadeInUp`}
      data-wow-delay={product.wowDelay}
    >
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={product.imgSrc}
            src={currentImage}
            alt="image-product"
            width={351}
            height={468}
          />
          <Image
            className="lazyload img-hover"
            data-src={product.imgHover}
            src={product.imgHover}
            alt="image-product"
            width={600}
            height={800}
          />
        </Link>
        <div className="on-sale-wrap">
          <span className="on-sale-item">{product.saleText}</span>
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
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          <span className="old-price">${product.price.toFixed(2)}</span>$
          {product.oldPrice.toFixed(2)}
        </span>
        <ul className="list-color-product">
          {product.colors.map((color, idx) => (
            <li
              className={`list-color-item color-swatch ${
                currentImage == color.imgSrc ? "active" : ""
              }  ${color.bgColor == "bg-white" ? "line" : ""}`}
              onMouseOver={() => setCurrentImage(color.imgSrc)}
              key={idx}
            >
              <span className={`swatch-value ${color.bgColor}`} />
              <Image
                className="lazyload"
                data-src={color.imgSrc}
                src={color.imgSrc}
                alt="image-product"
                width={600}
                height={800}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="card-product-actions">
        <div className="card-product-actions-top">
          <button
            onClick={handleAddToWishlist}
            className="box-icon wishlist btn-icon-action"
            disabled={wishlistLoading}
            style={{ cursor: wishlistLoading ? "not-allowed" : "pointer", opacity: wishlistLoading ? 0.6 : 1 }}
          >
            <i className="icon icon-heart" />
            <span className="tooltip">
              {wishlistLoading ? "Adding..." : (isInWishlist(product._id || product.id) ? "Already Wishlisted" : "Wishlist")}
            </span>
          </button>
          <button
            onClick={() => addToCompareItem(product.id)}
            className="box-icon compare btn-icon-action"
          >
            <i className="icon icon-compare" />
            <span className="tooltip">
              {isAddedtoCompareItem(product.id) ? "Already Compare" : "Compare"}
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
              {isAddedToCartProducts(product.id) ? "Already Cart" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
