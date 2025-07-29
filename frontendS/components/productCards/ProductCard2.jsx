"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { convertAndFormatUSDToINR } from "@/utils/currencyConverter";

export default function ProductCard2({ product }) {
  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <div className="product-img">
          <Link href={`/product-detail/${product.slug}`}>
            <Image
              src={product.imgSrc}
              alt={product.title}
              width={400}
              height={400}
              className="img-product"
            />
            <Image
              src={product.imgHover}
              alt={product.title}
              width={400}
              height={400}
              className="img-hover"
            />
          </Link>
          <div className="on-sale-wrap">
            {product.onSale && (
              <div className="on-sale">
                <span className="text-btn-uppercase">Sale</span>
              </div>
            )}
            {product.isNew && (
              <div className="on-sale on-sale-new">
                <span className="text-btn-uppercase">New</span>
              </div>
            )}
          </div>
          <div className="product-actions">
            <div className="product-action">
              <button className="btn-wishlist">
                <i className="icon icon-heart" />
              </button>
            </div>
            <div className="product-action">
              <button className="btn-quick-view">
                <i className="icon icon-eye" />
              </button>
            </div>
            <div className="product-action">
              <button className="btn-compare">
                <i className="icon icon-compare" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category">
          <Link href={`/product-detail/${product.slug}`}>
            {product.category}
          </Link>
        </div>
        <h3 className="product-title">
          <Link href={`/product-detail/${product.slug}`}>
            {product.title}
          </Link>
        </h3>
        <div className="product-price">
          <span className="price">
            <span className="old-price">{convertAndFormatUSDToINR(product.oldPrice)}</span>
            {convertAndFormatUSDToINR(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
