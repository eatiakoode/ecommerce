"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useContextElement } from "@/context/Context";
import { formatCurrency } from "@/utlis/currency";

export default function LookbookProduct({ product, styleClass = "style-row" }) {
  const { setQuickViewItem } = useContextElement();
  
  const getSafeImageSrc = (src) => {
    if (!src || src === '' || src === 'null' || src === 'undefined') {
      return '/images/products/product-1.jpg';
    }
    
    if (src.startsWith('http')) return src;
    
    if (src.startsWith('upload-')) {
      return `/uploads/${src}`;
    }
    
    if (src.startsWith('/')) return src;
    
    return `/${src}`;
  };

  return (
    <div className={`loobook-product ${styleClass} `}>
      <div className="img-style">
        <Image 
          alt={product.title || "Product Image"} 
          src={getSafeImageSrc(product.imgSrc)} 
          width={151} 
          height={151}
          onError={(e) => {
            e.target.src = '/images/products/product-1.jpg';
          }}
        />
      </div>
      <div className="content">
        <div className="info">
          <Link
            href={`/product-detail/${product.id}`}
            className="text-title text-line-clamp-1 link"
          >
            {product.title}
          </Link>
          <div className="price text-button">{formatCurrency(product.price)}</div>
        </div>
        <a
          href="#quickView"
          onClick={() => setQuickViewItem(product)}
          data-bs-toggle="modal"
          className="btn-lookbook btn-line"
        >
          Quick View
        </a>
      </div>
    </div>
  );
}
