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
    console.log("Product color data:", product.color);
    console.log("Product size data:", product.size);
    
    if (product.size && product.size.length > 0 && !selectedSize) {
      setSelectedSize(product.size[0].value);
    }
    if (product.color && product.color.length > 0 && activeColor === "gray") {
      // Set the color to match what ColorSelect expects
      const firstColor = product.color[0];
      console.log("First color object:", firstColor);
      const colorValue = firstColor.color || firstColor.title?.toLowerCase() || firstColor.name?.toLowerCase() || firstColor.value?.toLowerCase();
      console.log("Setting color value to:", colorValue);
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
  } = useContextElement();
  
  const { token, isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      // Set message and show login modal
      setLoginModalMessage("Please login to add items to your cart.");
      const loginModal = document.getElementById('loginModal');
      if (loginModal && typeof bootstrap !== 'undefined') {
        // Use Bootstrap modal if available
        try {
          const modal = new bootstrap.Modal(loginModal);
          modal.show();
        } catch (error) {
          console.error('Bootstrap modal error:', error);
          // Fallback to alert
          alert("Please login to add items to cart. You will be redirected to the login page.");
          window.location.href = '/login';
        }
      } else {
        // Fallback to alert with login link
        alert("Please login to add items to cart. You will be redirected to the login page.");
        window.location.href = '/login';
      }
      return;
    }

    // Ensure we have a valid product ID
    const productId = product.id || product._id;
    if (!productId) {
      // Try to get product ID from URL as fallback
      const urlParts = window.location.pathname.split('/');
      const slugFromUrl = urlParts[urlParts.length - 1];
      console.log("Product ID not found, using slug from URL:", slugFromUrl);
      
      // For now, let's add to local cart only if we can't get a proper ID
      const cartItem = {
        ...product,
        id: slugFromUrl, // Use slug as temporary ID
        quantity: quantity,
        price: product.price || product.sellingPrice || 0,
        title: product.title || product.name || 'Product',
        imgSrc: product.images?.[0]?.src || product.images?.[0]?.url || '/images/products/no-image.png',
        selectedColor: activeColor,
        selectedSize: selectedSize,
      };
      addProductToCartDirect(cartItem, quantity, false);
      alert(`Product "${product.title}" (${activeColor}, ${selectedSize}) added to cart! (Local only - backend sync requires valid product ID)`);
      return;
    }

    // Find selected color and size objects
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

    // Check if color and size are required for this product
    const hasColors = product.color && product.color.length > 0;
    const hasSizes = product.size && product.size.length > 0;

    if (hasColors && !selectedColorObj) {
      alert("Please select a color before adding to cart.");
      return;
    }

    if (hasSizes && !selectedSizeObj) {
      alert("Please select a size before adding to cart.");
      return;
    }

    // If product has no colors or sizes, allow adding without selection
    if (!hasColors && !hasSizes) {
      console.log("Product has no colors or sizes, proceeding without selection");
    }

    setLoading(true);
    try {
      const cartData = {
        productId: productId,
        quantity,
        ...(selectedColorObj?._id && { color: selectedColorObj._id }),
        ...(selectedSizeObj?._id && { size: selectedSizeObj._id }),
      };

      const result = await addToCart(token, cartData);
      
      if (result.success) {
        // Add to local cart for immediate UI update
        const cartItem = {
          ...product,
          id: product.id || product._id,
          quantity: quantity,
          price: product.price || product.sellingPrice || 0,
          title: product.title || product.name || 'Product',
          imgSrc: product.images?.[0]?.src || product.images?.[0]?.url || '/images/products/no-image.png',
          selectedColor: activeColor,
          selectedSize: selectedSize,
        };
        addProductToCartDirect(cartItem, quantity, false);
        
        alert(`Product "${product.title}" (${activeColor}, ${selectedSize}) added to cart successfully!`);
      } else {
        alert("Error adding to cart: " + (result.error || "Unknown error occurred"));
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Error adding to cart: " + error.message);
    } finally {
      setLoading(false);
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
                          isAddedToCartProducts(product.id)
                            ? cartProducts.filter(
                                (elm) => elm.id == product.id
                              )[0].quantity
                            : quantity
                        }
                        setQuantity={(qty) => {
                          if (isAddedToCartProducts(product.id)) {
                            updateQuantity(product.id, qty);
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
                            {loading ? "Adding..." : "Add to cart -"}
                          </span>
                          <span className="tf-qty-price total-price">
                            ₹{ (product.price * quantity).toFixed(2) }
                          </span>
                        </a>
                        <a
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
                        </a>
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
                      <a href="#" className="btn-style-3 text-btn-uppercase">
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
