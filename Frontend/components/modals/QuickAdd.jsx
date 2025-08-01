"use client";
import React, { useState } from "react";
import ColorSelect from "../productDetails/ColorSelect";
import SizeSelect from "../productDetails/SizeSelect";
import QuantitySelect from "../productDetails/QuantitySelect";
import { useContextElement } from "../../context/Context";
import { allProducts } from "../../data/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function QuickAdd() {
  const [quantity, setQuantity] = useState(1);
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
  } = useContextElement();

  // Safe price handling
  const getSafePrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 0;
    }
    return parseFloat(price);
  };

  // Don't render if quickAddItem is not available
  if (!quickAddItem) {
    return null;
  }

  const safePrice = getSafePrice(quickAddItem.price);
  const safeOldPrice = getSafePrice(quickAddItem.oldPrice);

  const [item, setItem] = useState(allProducts[0]);
  useEffect(() => {
    const filtered = allProducts.filter((el) => el.id == quickAddItem);
    if (filtered) {
      setItem(filtered[0]);
    }
  }, [quickAddItem]);
  return (
    <div className="modal fade modal-quick-add" id="quickAdd">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div>
            <div className="tf-product-info-list">
              <div className="tf-product-info-item">
                <div className="image">
                  <Image alt="" src={item.imgSrc} width={600} height={800} />
                </div>
                <div className="content">
                  <Link href={`/product-detail/${item.id}`}>{item.title}</Link>
                  <div className="tf-product-info-price">
                    <h5 className="price-on-sale font-2">
                      ₹{safePrice.toFixed(2)}
                    </h5>
                    {safeOldPrice > 0 ? (
                      <>
                        <div className="compare-at-price font-2">
                          {" "}
                          ₹{safeOldPrice.toFixed(2)}
                        </div>
                        <div className="badges-on-sale text-btn-uppercase">
                          -25%
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="tf-product-info-choose-option">
                <ColorSelect />
                <SizeSelect />
                <div className="tf-product-info-quantity">
                  <div className="title mb_12">Quantity:</div>
                  <QuantitySelect
                    quantity={
                      isAddedToCartProducts(item.id)
                        ? cartProducts.filter((elm) => elm.id == item.id)[0]
                            .quantity
                        : quantity
                    }
                    setQuantity={(qty) => {
                      if (isAddedToCartProducts(item.id)) {
                        updateQuantity(item.id, qty);
                      } else {
                        setQuantity(qty);
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="tf-product-info-by-btn mb_10">
                    <a
                      className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 show-shopping-cart"
                      onClick={() => addProductToCart(item.id, quantity)}
                    >
                      <span>
                        {isAddedToCartProducts(item.id)
                          ? "Already Added"
                          : "Add to cart -"}
                        &nbsp;
                      </span>
                      <span className="tf-qty-price total-price">
                        ₹
                        {isAddedToCartProducts(item.id)
                          ? (
                                safePrice *
                                (cartProducts.filter((elm) => elm.id == item.id)[0]?.quantity || 1)
                              ).toFixed(2)
                            : (safePrice * quantity).toFixed(2)}
                      </span>
                    </a>
                    <a
                      href="#compare"
                      onClick={() => addToCompareItem(item.id)}
                      data-bs-toggle="offcanvas"
                      aria-controls="compare"
                      className="box-icon hover-tooltip compare btn-icon-action show-compare"
                    >
                      <span className="icon icon-gitDiff" />
                      <span className="tooltip text-caption-2">
                        {" "}
                        {isAddedtoCompareItem(item.id)
                          ? "Already compared"
                          : "Compare"}
                      </span>
                    </a>
                    <a
                      onClick={() => addToWishlist(item.id)}
                      className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                    >
                      <span className="icon icon-heart" />
                      <span className="tooltip text-caption-2">
                        {isAddedtoWishlist(item.id)
                          ? "Already Wishlished"
                          : "Wishlist"}
                      </span>
                    </a>
                  </div>
                  <a href="#" className="btn-style-3 text-btn-uppercase">
                    Buy it now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
