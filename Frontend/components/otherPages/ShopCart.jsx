"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import { useAuth } from "@/context/AuthContext";
import { removeFromCart, updateCartItem } from "@/api/auth";

// Commented out coupon section for future use
/*
const discounts = [
  {
    discount: "10% OFF",
    details: "For all orders from 200₹",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200₹",
    code: "Mo234231",
  },
  {
    discount: "10% OFF",
    details: "For all orders from 200₹",
    code: "Mo234231",
  },
];
*/

const shippingOptions = [
  {
    id: "free",
    label: "Free Shipping",
    price: 0.0,
  },
  {
    id: "local",
    label: "Local:",
    price: 35.0,
  },
  {
    id: "rate",
    label: "Flat Rate:",
    price: 35.0,
  },
];

export default function ShopCart() {
  const [activeDiscountIndex, setActiveDiscountIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState(shippingOptions[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { cartProducts, setCartProducts, totalPrice, removeFromCartLocal, updateQuantity } = useContextElement();
  const { token, isAuthenticated } = useAuth();

  const setQuantity = async (id, quantity) => {
    if (quantity >= 1) {
      // Find the cart item
      const item = cartProducts.find(elm => elm.id == id || elm._id == id);
      if (item) {
        // Update local state immediately for better UX
        const updatedCart = cartProducts.map(cartItem => 
          (cartItem.id == id || cartItem._id == id) ? { ...cartItem, quantity } : cartItem
        );
        setCartProducts(updatedCart);
        
        // Sync with backend if user is authenticated and item has cartItemId
        if (isAuthenticated() && token && item.cartItemId) {
          try {
            const result = await updateCartItem(token, item.cartItemId, quantity);
            
            if (!result.success) {
              console.error("Failed to update quantity in backend:", result.error);
            }
          } catch (error) {
            console.error("Error updating quantity in backend:", error);
          }
        }
      }
    }
  };

  const removeItem = async (id) => {
    // Find the cart item
    const item = cartProducts.find(elm => elm.id == id || elm._id == id);
    if (item) {
      // Remove from local state immediately for better UX
      setCartProducts((pre) => [...pre.filter((elm) => elm.id != id && elm._id != id)]);
      
      // Sync with backend if user is authenticated and item has cartItemId
      if (isAuthenticated() && token && item.cartItemId) {
        try {
          const result = await removeFromCart(token, item.cartItemId);
          
          if (!result.success) {
            console.error("Failed to remove item from backend:", result.error);
          }
        } catch (error) {
          console.error("Error removing item from backend:", error);
        }
      }
    }
  };

  const handleOptionChange = (elm) => {
    setSelectedOption(elm);
  };

  const handleColorChange = (productId, color) => {
    const updatedCart = cartProducts.map(item => 
      item.id === productId ? { ...item, selectedColor: color } : item
    );
    setCartProducts(updatedCart);
  };

  const handleSizeChange = (productId, size) => {
    const updatedCart = cartProducts.map(item => 
      item.id === productId ? { ...item, selectedSize: size } : item
    );
    setCartProducts(updatedCart);
  };

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + selectedOption.price;
  };

  const canProceedToCheckout = () => {
    return cartProducts.length > 0 && agreedToTerms;
  };

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              {cartProducts.length ? (
                <form onSubmit={(e) => e.preventDefault()}>
                  <table className="tf-table-page-cart" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className="text-left" style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #eee' }}>Products</th>
                        <th className="text-center" style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>Price</th>
                        <th className="text-center" style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>Quantity</th>
                        <th className="text-center" style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>Total Price</th>
                        <th className="text-center" style={{ textAlign: 'center', padding: '12px', borderBottom: '1px solid #eee' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartProducts.map((elm, i) => (
                        <tr key={i} className="tf-cart-item file-delete">
                          <td className="tf-cart-item_product text-left">
                            <Link
                              href={`/product-detail/${elm.slug || elm.id}`}
                              className="img-box"
                            >
                              <Image
                                alt="product"
                                src={elm.imgSrc}
                                width={600}
                                height={800}
                              />
                            </Link>
                            <div className="cart-info">
                              <Link
                                href={`/product-detail/${elm.slug || elm.id}`}
                                className="cart-title link"
                              >
                                {elm.title}
                              </Link>
                              <div className="variant-box">
                                <div className="selected-options" style={{ marginTop: '8px' }}>
                                  <span className="selected-color" style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    color: '#666', 
                                    marginBottom: '4px' 
                                  }}>
                                    Color: {typeof elm.selectedColor === 'object' ? elm.selectedColor?.name || elm.selectedColor?.title || elm.selectedColor?.value : elm.selectedColor || 'Not selected'}
                                  </span>
                                  <span className="selected-size" style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    color: '#666' 
                                  }}>
                                    Size: {typeof elm.selectedSize === 'object' ? elm.selectedSize?.name || elm.selectedSize?.title || elm.selectedSize?.value : elm.selectedSize || 'Not selected'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            data-cart-title="Price"
                            className="tf-cart-item_price text-center"
                            style={{ textAlign: 'center', padding: '12px', verticalAlign: 'middle' }}
                          >
                            <div className="cart-price text-button price-on-sale">
                              ₹{elm.price.toFixed(2)}
                            </div>
                          </td>
                          <td
                            data-cart-title="Quantity"
                            className="tf-cart-item_quantity text-center"
                            style={{ textAlign: 'center', padding: '12px', verticalAlign: 'middle' }}
                          >
                            <div className="wg-quantity mx-auto">
                              <span
                                className="btn-quantity btn-decrease"
                                onClick={() =>
                                  setQuantity(elm.id, elm.quantity - 1)
                                }
                              >
                                -
                              </span>
                              <input
                                type="text"
                                className="quantity-product"
                                name="number"
                                value={elm.quantity}
                                readOnly
                              />
                              <span
                                className="btn-quantity btn-increase"
                                onClick={() =>
                                  setQuantity(elm.id, elm.quantity + 1)
                                }
                              >
                                +
                              </span>
                            </div>
                          </td>
                          <td
                            data-cart-title="Total"
                            className="tf-cart-item_total text-center"
                            style={{ textAlign: 'center', padding: '12px', verticalAlign: 'middle' }}
                          >
                            <div className="cart-total text-button total-price">
                              ₹{(elm.price * elm.quantity).toFixed(2)}
                            </div>
                          </td>
                          <td
                            data-cart-title="Remove"
                            className="remove-cart text-center"
                            style={{ textAlign: 'center', padding: '12px', verticalAlign: 'middle' }}
                            onClick={() => removeItem(elm.id)}
                          >
                            <span className="remove icon icon-close" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Commented out coupon section for future use */}
                  {/*
                  <div className="ip-discount-code">
                    <input type="text" placeholder="Add voucher discount" />
                    <button className="tf-btn">
                      <span className="text">Apply Code</span>
                    </button>
                  </div>
                  <div className="group-discount">
                    {discounts.map((item, index) => (
                      <div
                        key={index}
                        className={`box-discount ₹{
                          activeDiscountIndex === index ? "active" : ""
                        }`}
                        onClick={() => setActiveDiscountIndex(index)}
                      >
                        <div className="discount-top">
                          <div className="discount-off">
                            <div className="text-caption-1">Discount</div>
                            <span className="sale-off text-btn-uppercase">
                              {item.discount}
                            </span>
                          </div>
                          <div className="discount-from">
                            <p className="text-caption-1">{item.details}</p>
                          </div>
                        </div>
                        <div className="discount-bot">
                          <span className="text-btn-uppercase">
                            {item.code}
                          </span>
                          <button className="tf-btn">
                            <span className="text">Apply Code</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  */}
                </form>
              ) : (
                <div className="text-center py-5">
                  <h4>Your cart is empty</h4>
                  <p>Start adding your favorite products to your cart!</p>
                  <Link className="btn-line" href="/shop-default-grid">
                    Explore Products
                  </Link>
                </div>
              )}

              {/* You May Also Like Section - REMOVED (duplicate of RecentProducts component) */}
            </div>
            <div className="col-xl-4">
              <div className="fl-sidebar-cart">
                <div className="box-order bg-surface">
                  <h5 className="title">Order Summary</h5>
                  <div className="subtotal text-button d-flex justify-content-between align-items-center">
                    <span>Subtotal</span>
                    <span className="total">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="discount text-button d-flex justify-content-between align-items-center">
                    <span>Discounts</span>
                    <span className="total">₹0.00</span>
                  </div>
                  <div className="ship">
                    <span className="text-button">Shipping</span>
                    <div className="flex-grow-1">
                      {shippingOptions.map((option) => (
                        <fieldset key={option.id} className="ship-item">
                          <input
                            type="radio"
                            name="ship-check"
                            className="tf-check-rounded"
                            id={option.id}
                            checked={selectedOption.id === option.id}
                            onChange={() => handleOptionChange(option)}
                          />
                          <label htmlFor={option.id}>
                            <span>{option.label}</span>
                            <span className="price">
                              ₹{option.price.toFixed(2)}
                            </span>
                          </label>
                        </fieldset>
                      ))}
                    </div>
                  </div>
                  <h5 className="total-order d-flex justify-content-between align-items-center">
                    <span>Total</span>
                    <span className="total">
                      ₹{calculateTotal().toFixed(2)}
                    </span>
                  </h5>
                  <div className="box-progress-checkout">
                    <fieldset className="check-agree">
                      <input
                        type="checkbox"
                        id="check-agree"
                        className="tf-check-rounded"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label htmlFor="check-agree">
                        I agree with the
                        <Link href={`/term-of-use`}>terms and conditions</Link>
                      </label>
                    </fieldset>
                    <Link 
                      href={canProceedToCheckout() ? `/checkout` : '#'} 
                      className={`tf-btn btn-reset ${!canProceedToCheckout() ? 'disabled' : ''}`}
                      style={{
                        opacity: canProceedToCheckout() ? 1 : 0.6,
                        cursor: canProceedToCheckout() ? 'pointer' : 'not-allowed',
                        pointerEvents: canProceedToCheckout() ? 'auto' : 'none'
                      }}
                      onClick={(e) => {
                        if (!canProceedToCheckout()) {
                          e.preventDefault();
                          alert('Please agree to terms and conditions and ensure your cart is not empty.');
                        }
                      }}
                    >
                      Process To Checkout
                    </Link>
                    <p className="text-button text-center">
                      Or continue shopping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}