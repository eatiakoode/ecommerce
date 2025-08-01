"use client";
import React, { useState } from "react";
import Image from "next/image";
import SizeSelect from "../productDetails/SizeSelect";
import ColorSelect from "../productDetails/ColorSelect";
import Grid5 from "../productDetails/grids/Grid5";
import { useContextElement } from "../../context/Context";
import QuantitySelect from "../productDetails/QuantitySelect";
export default function QuickView() {
  const [activeColor, setActiveColor] = useState("gray");
  const [quantity, setQuantity] = useState(1); // Initial quantity is 1
  const {
    quickViewItem,
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

  const openModalSizeChoice = () => {
    try {
      const bootstrap = require("bootstrap"); // dynamically import bootstrap
      var myModal = new bootstrap.Modal(document.getElementById("size-guide"), {
        keyboard: false,
      });

      myModal.show();
      document
        .getElementById("size-guide")
        .addEventListener("hidden.bs.modal", () => {
          myModal.hide();
        });
      const backdrops = document.querySelectorAll(".modal-backdrop");
      if (backdrops.length > 1) {
        // Apply z-index to the last backdrop
        const lastBackdrop = backdrops[backdrops.length - 1];
        lastBackdrop.style.zIndex = "1057";
      }
    } catch (error) {

      // Fallback: show size guide in a different way or alert
      alert('Size guide is not available. Please check the product details page.');
    }
  };

  // Don't render if quickViewItem is not available
  if (!quickViewItem) {
    return null;
  }

  const safePrice = getSafePrice(quickViewItem.price);
  const safeOldPrice = getSafePrice(quickViewItem.oldPrice);

  return (
    <div className="modal fullRight fade modal-quick-view" id="quickView">
      <div className="modal-dialog">
        <div className="modal-content">
          <Grid5
            firstItem={quickViewItem.imgSrc}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />
          <div className="wrap mw-100p-hidden">
            <div className="header">
              <h5 className="title">Quick View</h5>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-product-info-list">
              <div className="tf-product-info-heading">
                <div className="tf-product-info-name">
                  <div className="text text-btn-uppercase">Clothing</div>
                  <h3 className="name">{quickViewItem.title || 'Product Title'}</h3>
                  <div className="sub">
                    <div className="tf-product-info-rate">
                      <div className="list-star">
                        <i className="icon icon-star" />
                        <i className="icon icon-star" />
                        <i className="icon icon-star" />
                        <i className="icon icon-star" />
                        <i className="icon icon-star" />
                      </div>
                      <div className="text text-caption-1">(134 reviews)</div>
                    </div>
                    <div className="tf-product-info-sold">
                      <i className="icon icon-lightning" />
                      <div className="text text-caption-1">
                        18&nbsp;sold in last&nbsp;32&nbsp;hours
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tf-product-info-desc">
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
                  <p>
                    The garments labelled as Committed are products that have
                    been produced using sustainable fibres or processes,
                    reducing their environmental impact.
                  </p>
                  <div className="tf-product-info-liveview">
                    <i className="icon icon-eye" />
                    <p className="text-caption-1">
                      <span className="liveview-count">28</span> people are
                      viewing this right now
                    </p>
                  </div>
                </div>
              </div>
              <div className="tf-product-info-choose-option">
                <ColorSelect
                  activeColor={activeColor}
                  setActiveColor={setActiveColor}
                />
                <SizeSelect />
                <div className="tf-product-info-quantity">
                  <div className="title mb_12">Quantity:</div>
                  <QuantitySelect
                    quantity={
                      isAddedToCartProducts(quickViewItem.id)
                        ? cartProducts.filter(
                            (elm) => elm.id == quickViewItem.id
                          )[0]?.quantity || quantity
                        : quantity
                    }
                    setQuantity={(qty) => {
                      if (isAddedToCartProducts(quickViewItem.id)) {
                        updateQuantity(quickViewItem.id, qty);
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
                      onClick={() =>
                        addProductToCart(quickViewItem.id, quantity)
                      }
                    >
                      <span>
                        {isAddedToCartProducts(quickViewItem.id)
                          ? "Already Added"
                          : "Add to cart -"}
                      </span>
                      <span className="tf-qty-price total-price">
                        ₹
                        {isAddedToCartProducts(quickViewItem.id)
                          ? (
                              safePrice *
                              (cartProducts.filter(
                                (elm) => elm.id == quickViewItem.id
                              )[0]?.quantity || 1)
                            ).toFixed(2)
                          : (safePrice * quantity).toFixed(2)}
                      </span>
                    </a>
                    <a
                      href="#compare"
                      onClick={() => addToCompareItem(quickViewItem.id)}
                      data-bs-toggle="offcanvas"
                      aria-controls="compare"
                      className="box-icon hover-tooltip compare btn-icon-action show-compare"
                    >
                      <span className="icon icon-gitDiff" />
                      <span className="tooltip text-caption-2">
                        {" "}
                        {isAddedtoCompareItem(quickViewItem.id)
                          ? "Already compared"
                          : "Compare"}
                      </span>
                    </a>
                    <a
                      onClick={() => addToWishlist(quickViewItem.id)}
                      className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                    >
                      <span className="icon icon-heart" />
                      <span className="tooltip text-caption-2">
                        {isAddedtoWishlist(quickViewItem.id)
                          ? "Already Wishlisted"
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
