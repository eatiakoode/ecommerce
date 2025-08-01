"use client";
import React, { useEffect, useState } from "react";
import Slider1 from "../sliders/Slider1";
import ColorSelect from "../ColorSelect";
import SizeSelect from "../SizeSelect";
import QuantitySelect from "../QuantitySelect";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import { useAuth } from "@/context/AuthContext";
import { addToCart, addToWishlist as addToWishlistAPI } from "@/api/auth";
import ProductStikyBottom from "../ProductStikyBottom";
import LoginModal from "../../modals/LoginModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Details1({ product }) {
  const [activeColor, setActiveColor] = useState("gray");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("Please login to add items to your cart.");
  const [brandName, setBrandName] = useState("");

  // Set default size and color when product data is available
  useEffect(() => {
    if (product.size && product.size.length > 0 && !selectedSize) {
      setSelectedSize(product.size[0].value);
    }
    if (product.color && product.color.length > 0 && activeColor === "gray") {
      // Set the color to match what ColorSelect expects
      const firstColor = product.color[0];
      const colorValue = firstColor.color || firstColor.title?.toLowerCase() || firstColor.name?.toLowerCase() || firstColor.value?.toLowerCase();
      setActiveColor(colorValue);
    }
  }, [product.size, product.color, selectedSize, activeColor]);

  // Fetch brand name when product data is available
  useEffect(() => {
    const fetchBrandName = async () => {
      if (product.brand && typeof product.brand === 'object' && product.brand.title) {
        // Brand is already populated from the API
        setBrandName(product.brand.title);
      } else if (product.brand && typeof product.brand === 'string' && product.brand.length > 0) {
        // Brand is an ID, need to fetch the brand name
        try {
          const response = await fetch(`http://localhost:5000/api/brand/${product.brand}`);
          if (response.ok) {
            const brandData = await response.json();
            if (brandData && brandData.title) {
              setBrandName(brandData.title);
            } else {
              setBrandName("Unknown Brand");
            }
          } else {
            setBrandName("Unknown Brand");
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
          setBrandName("Unknown Brand");
        }
      } else {
        setBrandName("Unknown Brand");
      }
    };

    fetchBrandName();
  }, [product.brand]);
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    isAddedtoCompareItem,
    addToCompareItem,
    cartProducts,
    updateQuantity,
    addProductToCartDirect,
    setCartProducts,
  } = useContextElement();
  
  const { token, isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      setLoginModalMessage("Please login to add items to cart.");
      const loginModal = document.getElementById('loginModal');
      if (loginModal && typeof bootstrap !== 'undefined') {
        try {
          const modal = new bootstrap.Modal(loginModal);
          modal.show();
        } catch (error) {
          alert("Please login to add items to cart. You will be redirected to the login page.");
          window.location.href = '/login';
        }
      } else {
        alert("Please login to add items to cart. You will be redirected to the login page.");
        window.location.href = '/login';
      }
      return;
    }

    const productId = product.id || product._id;
    if (!productId) {
      alert("Error: Product ID not found.");
      return;
    }

    const selectedColorObj = product.color?.find(c => 
      c.value === activeColor || 
      c.title === activeColor || 
      c.color === activeColor ||
      c.value?.toLowerCase() === activeColor?.toLowerCase() ||
      c.title?.toLowerCase() === activeColor?.toLowerCase() ||
      c.color?.toLowerCase() === activeColor?.toLowerCase()
    );
    const selectedSizeObj = product.size?.find(s => 
      s.value === selectedSize || 
      s.name === selectedSize ||
      s.value?.toLowerCase() === selectedSize?.toLowerCase() ||
      s.name?.toLowerCase() === selectedSize?.toLowerCase()
    );

    const cartData = {
      productId: productId,
      quantity: quantity,
      ...(selectedColorObj?._id && { color: selectedColorObj._id }),
      ...(selectedSizeObj?._id && { size: selectedSizeObj._id }),
    };

    try {
      const result = await addToCart(token, cartData);
      
      if (result.success) {
        if (result.status === 200) {
          alert("Quantity updated successfully!");
        } else {
          alert("Product added to cart successfully!");
        }
        
        setTimeout(() => {
          window.scrollTo(0, 0);
          window.location.reload();
        }, 500);
      } else {
        alert("Failed to add product to cart: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error adding product to cart. Please try again.");
      
      setTimeout(() => {
        window.scrollTo(0, 0);
        window.location.reload();
      }, 500);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated()) {
      // Set message and show login modal
      setLoginModalMessage("Please login to add items to your wishlist.");
      const loginModal = document.getElementById('loginModal');
      if (loginModal && typeof bootstrap !== 'undefined') {
        // Use Bootstrap modal if available
        try {
          const modal = new bootstrap.Modal(loginModal);
          modal.show();
        } catch (error) {
          console.error('Bootstrap modal error:', error);
          // Fallback to alert
          alert("Please login to add items to wishlist. You will be redirected to the login page.");
          window.location.href = '/login';
        }
      } else {
        // Fallback to alert with login link
        alert("Please login to add items to wishlist. You will be redirected to the login page.");
        window.location.href = '/login';
      }
      return;
    }
    
    // Validate product ID
    const productId = product.id || product._id;
    if (!productId) {
      alert("Error: Product ID not found. Please try refreshing the page.");
      return;
    }
    
    setWishlistLoading(true);
    try {
      const result = await addToWishlistAPI(token, productId);
      
      if (result && result.success) {
        alert(`Product "${product.title}" added to wishlist!`);
      } else {
        const errorMessage = result && result.error ? result.error : "Unknown error occurred";
        
        // Handle specific error cases
        if (errorMessage.includes("already in wishlist")) {
          alert(`Product "${product.title}" is already in your wishlist!`);
        } else {
          alert("Error adding to wishlist: " + errorMessage);
        }
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      alert("Error adding to wishlist: " + (err.message || "Unknown error occurred"));
    } finally {
      setWishlistLoading(false);
    }
  };

  const router = useRouter();

  const handleBuyNow = () => {
    if (!isAuthenticated()) {
      setLoginModalMessage("Please login to proceed to checkout.");
      const loginModal = document.getElementById('loginModal');
      if (loginModal && typeof bootstrap !== 'undefined') {
        try {
          const modal = new bootstrap.Modal(loginModal);
          modal.show();
        } catch (error) {
          console.error('Bootstrap modal error:', error);
          alert("Please login to proceed to checkout. You will be redirected to the login page.");
          window.location.href = '/login';
        }
      } else {
        alert("Please login to proceed to checkout. You will be redirected to the login page.");
        window.location.href = '/login';
      }
      return;
    }

    const productId = product.id || product._id;
    if (!productId) {
      alert("Error: Product ID not found for buy now.");
      return;
    }

    const selectedColorObj = product.color?.find(c => 
      c.value === activeColor || 
      c.title === activeColor || 
      c.color === activeColor ||
      c.value?.toLowerCase() === activeColor?.toLowerCase() ||
      c.title?.toLowerCase() === activeColor?.toLowerCase() ||
      c.color?.toLowerCase() === activeColor?.toLowerCase()
    );
    const selectedSizeObj = product.size?.find(s => 
      s.value === selectedSize || 
      s.name === selectedSize ||
      s.value?.toLowerCase() === selectedSize?.toLowerCase() ||
      s.name?.toLowerCase() === selectedSize?.toLowerCase()
    );

    const cartItem = {
      productId: productId,
      quantity: quantity,
      ...(selectedColorObj?._id && { color: selectedColorObj._id }),
      ...(selectedSizeObj?._id && { size: selectedSizeObj._id }),
    };

    // Redirect to checkout page with product details
    router.push(`/checkout?productId=${productId}&color=${selectedColorObj?._id || activeColor}&size=${selectedSizeObj?._id || selectedSize}&quantity=${quantity}`);
  };

  return (
    <section className="flat-spacing">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product default */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <Slider1
                  setActiveColor={setActiveColor}
                  activeColor={activeColor}
                  firstItem={product.images && product.images.length > 0 ? product.images[0].src : null}
                  slideItems={product.images || []}
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative mw-100p-hidden ">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      <div className="text text-btn-uppercase">Clothing</div>
                      <h3 className="name">{product.title || "No Title"}</h3>
                     {/* < div className="sub">
                        <div className="tf-product-info-rate">
                          <div className="list-star">
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                          </div>
                          <div className="text text-caption-1">
                            (134 reviews)
                          </div>
                        </div>
                        <div className="tf-product-info-sold">
                          <i className="icon icon-lightning" />
                          <div className="text text-caption-1">
                            18&nbsp;sold in last&nbsp;32&nbsp;hours
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="tf-product-info-desc">
                      <div className="tf-product-info-price">
                        <h5 className="price-on-sale font-2">
                          {" "}
                          ₹{typeof product.price === "number" && !isNaN(product.price) ? product.price.toFixed(2) : "0.00"}
                        </h5>
                        {product.oldPrice ? (
                          <>
                            <div className="compare-at-price font-2">
                              {" "}
                              ₹{product.oldPrice.toFixed(2)}
                            </div>
                            <div className="badges-on-sale text-btn-uppercase">
                              -25%
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <p>{product.longDescription}</p>
                      <div className="tf-product-info-liveview">
                        {/* <i className="icon icon-eye" /> */}
                        {/* <p className="text-caption-1">
                          <span className="liveview-count">28</span> people are
                          viewing this right now
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-choose-option">
                    <ColorSelect
                      setActiveColor={setActiveColor}
                      activeColor={activeColor}
                      colors={product.color || []}
                    />
                    <SizeSelect
                      sizes={product.size || []}
                      selectedSize={selectedSize}
                      setSelectedSize={setSelectedSize}
                    />
                    <div className="tf-product-info-quantity">
                      <div className="title mb_12">Quantity:</div>
                      <QuantitySelect
                        quantity={
                          isAddedToCartProducts(product.id, activeColor, selectedSize)
                            ? (() => {
                                const normalizeValue = (value) => {
                                  if (!value) return '';
                                  return value.toString().toLowerCase().trim();
                                };
                                
                                const currentColor = normalizeValue(activeColor);
                                const currentSize = normalizeValue(selectedSize);
                                
                                const existingItem = cartProducts.find(item => {
                                  const itemColor = normalizeValue(item.selectedColor);
                                  const itemSize = normalizeValue(item.selectedSize);
                                  return item.id === product.id && 
                                         itemColor === currentColor && 
                                         itemSize === currentSize;
                                });
                                
                                return existingItem ? existingItem.quantity : quantity;
                              })()
                            : quantity
                        }
                        setQuantity={(qty) => {
                          if (isAddedToCartProducts(product.id, activeColor, selectedSize)) {
                            updateQuantity(product.id, qty, activeColor, selectedSize);
                          } else {
                            setQuantity(qty);
                          }
                        }}
                        max={product.quantity || 1}
                      />
                    </div>
                    <div>
                      <div className="tf-product-info-by-btn mb_10">
                        <a
                          onClick={handleAddToCart}
                          className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 btn-add-to-cart"
                          style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
                        >
                          <span>
                            {loading ? "Adding..." : 
                             isAddedToCartProducts(product.id, activeColor, selectedSize) ? 
                             "Update Quantity -" : "Add to cart -"}
                          </span>
                          <span className="tf-qty-price total-price">
                            ₹{ (product.price * quantity).toFixed(2) }
                          </span>
                        </a>
                        {/* <a
                          href="#compare"
                          data-bs-toggle="offcanvas"
                          aria-controls="compare"
                          onClick={() => addToCompareItem(product.id)}
                          className="box-icon hover-tooltip compare btn-icon-action"
                        >
                          <span className="icon icon-gitDiff" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoCompareItem(product.id)
                              ? "Already compared"
                              : "Compare"}
                          </span>
                        </a> */}
                        <a
                          onClick={handleAddToWishlist}
                          className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                          style={{ cursor: wishlistLoading ? "not-allowed" : "pointer", opacity: wishlistLoading ? 0.6 : 1 }}
                        >
                          <span className="icon icon-heart" />
                          <span className="tooltip text-caption-2">
                            {wishlistLoading ? "Adding..." : (isAddedtoWishlist(product.id) ? "Already Wishlished" : "Wishlist")}
                          </span>
                        </a>
                      </div>
                      <a href="#" className="btn-style-3 text-btn-uppercase" onClick={handleBuyNow} style={{ cursor: 'pointer' }}>
                        Buy it now
                      </a>
                    </div>
                    <div className="tf-product-info-help">
                      <div className="tf-product-info-extra-link">
                        <a
                          href="#delivery_return"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-shipping" />
                          </div>
                          <p className="text-caption-1">
                            Delivery &amp; Return
                          </p>
                        </a>
                        <a
                          href="#ask_question"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-question" />
                          </div>
                          <p className="text-caption-1">Ask A Question</p>
                        </a>
                        <a
                          href="#share_social"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-share" />
                          </div>
                          <p className="text-caption-1">Share</p>
                        </a>
                      </div>
                      <div className="tf-product-info-time">
                        <div className="icon">
                          <i className="icon-timer" />
                        </div>
                        <p className="text-caption-1">
                          Estimated Delivery:&nbsp;&nbsp;<span>12-26 days</span>
                          (International), <span>3-6 days</span> (United States)
                        </p>
                      </div>
                      <div className="tf-product-info-return">
                        <div className="icon">
                          <i className="icon-arrowClockwise" />
                        </div>
                        <p className="text-caption-1">
                          Return within <span>45 days</span> of purchase. Duties
                          &amp; taxes are non-refundable.
                        </p>
                      </div>
                      <div className="dropdown dropdown-store-location">
                        <div
                          className="dropdown-title dropdown-backdrop"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                        >
                          <div className="tf-product-info-view link">
                            <div className="icon">
                              <i className="icon-map-pin" />
                            </div>
                            <span>View Store Information</span>
                          </div>
                        </div>
                        <div className="dropdown-menu dropdown-menu-end">
                          <div className="dropdown-content">
                            <div className="dropdown-content-heading">
                              <h5>Store Location</h5>
                              <i className="icon icon-close" />
                            </div>
                            <div className="line-bt" />
                            <div>
                              <h6>Fashion Modave</h6>
                              <p>Pickup available. Usually ready in 24 hours</p>
                            </div>
                            <div>
                              <p>766 Rosalinda Forges Suite 044,</p>
                              <p>Gracielahaven, Oregon</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="tf-product-info-sku">
                      <li>
                        <p className="text-caption-1">SKU:</p>
                        <p className="text-caption-1 text-1">{product.SKU}</p>
                      </li>
                      <li>
                        <p className="text-caption-1">Brand:</p>
                        <p className="text-caption-1 text-1">{brandName}</p>
                      </li>
                      <li>
                        <p className="text-caption-1">Available:</p>
                        <p className="text-caption-1 text-1">Instock</p>
                      </li>
                      <li>
                        <p className="text-caption-1">Categories:</p>
                        <p className="text-caption-1">
  {product.categories && product.categories.map((cat, idx) => (
    <span key={cat._id}>
      <a href="#" className="text-1 link">{cat.name}</a>
      {idx < product.categories.length - 1 ? ', ' : ''}
    </span>
  ))}
</p>
                      </li>
                    </ul>
                    <div className="tf-product-info-guranteed">
                      <div className="text-title">Guranteed safe checkout:</div>
                      <div className="tf-payment">
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-1.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-2.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-3.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-4.png"
                            width={98}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-5.png"
                            width={102}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-6.png"
                            width={98}
                            height={64}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
      <ProductStikyBottom />
      <LoginModal message={loginModalMessage} />
    </section>
  );
}
