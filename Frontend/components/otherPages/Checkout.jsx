"use client";

import { useContextElement } from "@/context/Context";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { getUserAddresses } from "@/api/address";
import { countries } from "@/data/countries";
import { indianStates } from "@/data/states";

// Commented out discount section for future use
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

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, loading: authLoading, isAuthenticated } = useAuth();
  const [activeDiscountIndex, setActiveDiscountIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [isDirectPurchase, setIsDirectPurchase] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    street: '',
    postalCode: '',
    note: '',
    // Payment fields - commented out since only COD is available
    // cardName: '',
    // cardNumber: '',
    // expiryDate: '',
    // cvv: '',
    // saveCard: false
  });

  const { cartProducts, totalPrice, clearCart, setCartProducts } = useContextElement();

  // Handle direct product purchase from BUY IT NOW
  useEffect(() => {
    const productId = searchParams.get('productId');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const quantity = searchParams.get('quantity');

    if (productId && quantity) {
      // This is a direct purchase, not from cart
      // We need to fetch the product details and add it to a temporary cart
      const handleDirectPurchase = async () => {
        try {
          // Fetch product details
          const response = await fetch(`http://localhost:5000/api/frontend/product/${productId}`);
          if (response.ok) {
            const productData = await response.json();
            
            if (productData.success) {
              const product = productData.data;
              
              // Create a cart item for direct purchase
              const directPurchaseItem = {
                id: product._id,
                _id: product._id,
                title: product.title || product.name,
                name: product.title || product.name,
                price: product.price || product.sellingPrice,
                sellingPrice: product.price || product.sellingPrice,
                images: product.images || [],
                imgSrc: product.images?.[0]?.url || product.images?.[0]?.src || '/images/products/no-image.png',
                quantity: parseInt(quantity) || 1,
                selectedColor: color || null,
                selectedSize: size || null,
                // For direct purchase, we don't have cartItemId since it's not in the cart
              };
              
              // Set this as the only item in cart for checkout
              setCartProducts([directPurchaseItem]);
              setIsDirectPurchase(true);
            }
          }
        } catch (error) {
          console.error('Error fetching product for direct purchase:', error);
          alert('Error loading product details. Please try again.');
          router.push('/');
        }
      };
      
      handleDirectPurchase();
    }
  }, [searchParams, setCartProducts, router]);

  // Check authentication and pre-fill form data
  useEffect(() => {
    if (!authLoading) {
  
      if (isAuthenticated() && user) {
        
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          firstName: user.firstName || user.firstname || '',
          lastName: user.lastName || user.lastname || '',
          email: user.email || '',
          phone: user.phone || user.mobile || ''
        }));
      }
      setLoading(false);
    }
  }, [authLoading, user, isAuthenticated]);

  // Fetch saved addresses
  useEffect(() => {
    if (isAuthenticated() && token) {
      fetchSavedAddresses();
    }
  }, [isAuthenticated, token]);

  const fetchSavedAddresses = async () => {
    try {
      setAddressLoading(true);
      const result = await getUserAddresses(token);
      
      if (result.success) {
        setSavedAddresses(result.data || []);
        // Auto-select default address if available
        const defaultAddress = result.data?.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          fillFormWithAddress(defaultAddress);
        }
      } else {

      }
    } catch (error) {
      
    } finally {
      setAddressLoading(false);
    }
  };

  const fillFormWithAddress = (address) => {
    setFormData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      country: address.country,
      state: address.state,
      city: address.city,
      street: address.address,
      postalCode: address.zipCode
    }));
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
    
    const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      fillFormWithAddress(selectedAddress);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId('');
    // Reset form to user's basic info
    setFormData(prev => ({
      ...prev,
      firstName: user?.firstName || user?.firstname || '',
      lastName: user?.lastName || user?.lastname || '',
      email: user?.email || '',
      phone: user?.phone || user?.mobile || '',
      country: 'India',
      state: '',
      city: '',
      street: '',
      postalCode: '',
      note: ''
    }));
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      router.push('/login?redirect=checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'postalCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Only COD is available for now
    if (paymentMethod !== 'cod') {
      alert('Only Cash on Delivery is available at the moment');
      return false;
    }

    return true;
  };

  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userEmail: formData.email,
          orderData: orderData
        })
      });

      if (!response.ok) {

      }
    } catch (error) {
      
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (cartProducts.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setProcessingPayment(true);

    try {
      // Prepare order data according to backend structure
      const orderData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        address: formData.street,
        city: formData.city,
        state: formData.state,
        other: formData.note,
        pincode: parseInt(formData.postalCode) || 0
      };

      // Create order using the checkout endpoint
      const response = await fetch('http://localhost:5000/api/frontend/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Save order details to localStorage for thank you page
        const orderDetails = {
          orderId: result.orderId,
          invoiceNo: result.invoiceNo,
          orderDate: new Date().toISOString(),
          amount: cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0),
          firstname: formData.firstName,
          lastname: formData.lastName,
          address: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.postalCode,
          items: cartProducts.map(item => ({
            name: item.title || item.name || 'Product',
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
            quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1,
            size: item.selectedSize || 'N/A',
            color: item.selectedColor || 'N/A',
            image: item.imgSrc || item.image || '/images/products/no-image.png'
          }))
        };
        
        localStorage.setItem('lastOrderDetails', JSON.stringify(orderDetails));
        
        // Send confirmation email
        await sendOrderConfirmationEmail({
          ...orderData,
          orderId: result.orderId,
          invoiceNo: result.invoiceNo
        });

        // Clear cart after successful order
        if (!isDirectPurchase) {
          clearCart();
        }

        // Redirect to thank you page with order details
        router.push(`/thank-you?orderId=${result.orderId}&invoiceNo=${result.invoiceNo}`);
      } else {
        const error = await response.json();
        alert(`Order failed: ${error.message}`);
      }
    } catch (error) {
      
      alert('Order processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Check if India is selected to show states dropdown
  const isIndiaSelected = formData.country === "India";

  if (authLoading || loading) {
    return (
      <section>
        <div className="container">
          <div className="text-center py-5">
            <h4>Loading checkout...</h4>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated()) {
    return null; // Will redirect to login
  }

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="flat-spacing tf-page-checkout">
              <div className="wrap">
                <div className="title-login">
                  <p>Welcome back, {user?.firstName || 'User'}!</p>
                  <p className="text-secondary">Your information is pre-filled below</p>
                  {isDirectPurchase && (
                    <div className="alert alert-info" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '4px', color: '#0c5460' }}>
                      <strong>Direct Purchase:</strong> You're purchasing this item directly without adding it to your cart.
                    </div>
                  )}
                </div>
                {/* Login section is hidden for logged-in users */}
              </div>
              
              <div className="wrap">
                <h5 className="title">Shipping Address</h5>
                
                {/* Saved Addresses Section */}
                {savedAddresses.length > 0 && (
                  <div className="saved-addresses-section" style={{ marginBottom: '20px' }}>
                    <div className="address-selection" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                        Choose a saved address:
                      </label>
                      <div className="saved-addresses-list">
                        {savedAddresses.map((address) => (
                          <div 
                            key={address._id} 
                            className={`saved-address-item ${selectedAddressId === address._id ? 'selected' : ''}`}
                            style={{
                              border: selectedAddressId === address._id ? '2px solid #007bff' : '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '12px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              backgroundColor: selectedAddressId === address._id ? '#f8f9fa' : 'white'
                            }}
                            onClick={() => handleAddressSelection(address._id)}
                          >
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                              {address.title} {address.isDefault && <span style={{ color: '#007bff', fontSize: '12px' }}>(Default)</span>}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {address.firstName} {address.lastName}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {address.address}, {address.city}, {address.state}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {address.country} {address.zipCode}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {address.phone}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="new-address-option" style={{ marginTop: '15px' }}>
                      <button
                        type="button"
                        onClick={handleUseNewAddress}
                        style={{
                          background: 'none',
                          border: '1px solid #007bff',
                          color: '#007bff',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Use New Address
                      </button>
                    </div>
                  </div>
                )}
                
                <form className="info-box" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid-2">
                    <input 
                      type="text" 
                      placeholder="First Name*" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name*" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                  <div className="grid-2">
                    <input 
                      type="email" 
                      placeholder="Email Address*" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number*" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="tf-select">
                    <select
                      className="text-title"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    >
                      <option value="">Select Country*</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid-2">
                    <input 
                      type="text" 
                      placeholder="Town/City*" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Street Address*" 
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                    />
                  </div>
                  <div className="grid-2">
                    {isIndiaSelected ? (
                      <div className="tf-select">
                        <select 
                          className="text-title" 
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        >
                          <option value="">Choose State</option>
                          {indianStates.map((state) => (
                            <option key={state.code} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        placeholder="State/Province" 
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                      />
                    )}
                    <input 
                      type="text" 
                      placeholder="Postal Code*" 
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  </div>
                  <textarea 
                    placeholder="Write note..." 
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                  />
                </form>
              </div>
              
              <div className="wrap">
                <h5 className="title">Choose payment Option:</h5>
                <form className="form-payment" onSubmit={handlePayment}>
                  <div className="payment-box" id="payment-box">
                    {/* Credit Card Payment - Commented out for now */}
                    {/*
                    <div className={`payment-item payment-choose-card ${paymentMethod === 'credit-card' ? 'active' : ''}`}>
                      <label
                        htmlFor="credit-card-method"
                        className="payment-header"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="credit-card-method"
                          checked={paymentMethod === 'credit-card'}
                          onChange={() => handlePaymentMethodChange('credit-card')}
                        />
                        <span className="text-title">Credit Card</span>
                      </label>
                      {paymentMethod === 'credit-card' && (
                        <div className="payment-body">
                          <p className="text-secondary">
                            Make your payment directly into our bank account.
                            Your order will not be shipped until the funds have
                            cleared in our account.
                          </p>
                          <div className="input-payment-box">
                            <input 
                              type="text" 
                              placeholder="Name On Card*" 
                              value={formData.cardName}
                              onChange={(e) => handleInputChange('cardName', e.target.value)}
                            />
                            <div className="ip-card">
                              <input 
                                type="text" 
                                placeholder="Card Numbers*" 
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                maxLength="16"
                              />
                              <div className="list-card">
                                <Image
                                  width={48}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-7.png"
                                />
                                <Image
                                  width={21}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-8.png"
                                />
                                <Image
                                  width={22}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-9.png"
                                />
                                <Image
                                  width={24}
                                  height={16}
                                  alt="card"
                                  src="/images/payment/img-10.png"
                                />
                              </div>
                            </div>
                            <div className="grid-2">
                              <input 
                                type="month" 
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              />
                              <input 
                                type="text" 
                                placeholder="CVV*" 
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                maxLength="4"
                              />
                            </div>
                          </div>
                          <div className="check-save">
                            <input
                              type="checkbox"
                              className="tf-check"
                              id="check-card"
                              checked={formData.saveCard}
                              onChange={(e) => handleInputChange('saveCard', e.target.checked)}
                            />
                            <label htmlFor="check-card">
                              Save Card Details
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    */}
                    
                    <div className={`payment-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <label
                        htmlFor="delivery-method"
                        className="payment-header"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="delivery-method"
                          checked={paymentMethod === 'cod'}
                          onChange={() => handlePaymentMethodChange('cod')}
                        />
                        <span className="text-title">Cash on delivery</span>
                      </label>
                      {paymentMethod === 'cod' && (
                        <div className="payment-body">
                          <p className="text-secondary">
                            Pay with cash when your order is delivered. You will receive an email confirmation once your order is placed. 
                            This is the only payment method currently available.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Apple Pay - Commented out for now */}
                    {/*
                    <div className={`payment-item ${paymentMethod === 'apple-pay' ? 'active' : ''}`}>
                      <label
                        htmlFor="apple-method"
                        className="payment-header"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="apple-method"
                          checked={paymentMethod === 'apple-pay'}
                          onChange={() => handlePaymentMethodChange('apple-pay')}
                        />
                        <span className="text-title apple-pay-title">
                          <Image
                            alt="apple"
                            src="/images/payment/applePay.png"
                            width={13}
                            height={18}
                          />
                          Apple Pay
                        </span>
                      </label>
                    </div>
                    */}
                    
                    {/* PayPal - Commented out for now */}
                    {/*
                    <div className={`payment-item paypal-item ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                      <label
                        htmlFor="paypal-method"
                        className="payment-header"
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="tf-check-rounded"
                          id="paypal-method"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => handlePaymentMethodChange('paypal')}
                        />
                        <span className="paypal-title">
                          <Image
                            alt="paypal"
                            src="/images/payment/paypal.png"
                            width={90}
                            height={23}
                          />
                        </span>
                      </label>
                    </div>
                    */}
                  </div>
                  <button 
                    className="tf-btn btn-reset" 
                    type="submit"
                    disabled={processingPayment}
                  >
                    {processingPayment ? 'Processing Order...' : 'Place Order (COD)'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-xl-1">
            <div className="line-separation" />
          </div>
          
          <div className="col-xl-5">
            <div className="flat-spacing flat-sidebar-checkout">
              <div className="sidebar-checkout-content">
                <h5 className="title">Shopping Cart</h5>
                <div className="list-product">
                  {cartProducts.map((elm, i) => (
                    <div key={i} className="item-product">
                      <Link
                        href={`/product-detail/${elm.slug || elm.id}`}
                        className="img-product"
                      >
                        <Image
                          alt="img-product"
                          src={elm.imgSrc}
                          width={600}
                          height={800}
                        />
                      </Link>
                      <div className="content-box">
                        <div className="info">
                          <Link
                            href={`/product-detail/${elm.slug || elm.id}`}
                            className="name-product link text-title"
                          >
                            {elm.title}
                          </Link>
                          <div className="variant text-caption-1 text-secondary">
                            <span className="size">{typeof elm.selectedSize === 'object' ? elm.selectedSize?.name || 'L' : elm.selectedSize || 'L'}</span>/
                            <span className="color">{typeof elm.selectedColor === 'object' ? elm.selectedColor?.name || 'Blue' : elm.selectedColor || 'Blue'}</span>
                          </div>
                        </div>
                        <div className="total-price text-button">
                          <span className="count">{elm.quantity}</span>X
                          <span className="price">₹{elm.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Commented out discount section for future use */}
                {/*
                <div className="sec-discount">
                  <Swiper
                    // dir="ltr"
                    className="swiper tf-sw-categories"
                    slidesPerView={2.25}
                    breakpoints={{
                      1024: { slidesPerView: 2.25 },
                      768: { slidesPerView: 3 },
                      640: { slidesPerView: 2.5 },
                      0: { slidesPerView: 1.2 },
                    }}
                    spaceBetween={20}
                  >
                    {discounts.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div
                          className={`box-discount ${
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
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="ip-discount-code">
                    <input type="text" placeholder="Add voucher discount" />
                    <button className="tf-btn">
                      <span className="text">Apply Code</span>
                    </button>
                  </div>
                  <p>
                    Discount code is only used for orders with a total value of
                    products over ₹500.00
                  </p>
                </div>
                */}
                
                <div className="sec-total-price">
                  <div className="top">
                    <div className="item d-flex align-items-center justify-content-between text-button">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="item d-flex align-items-center justify-content-between text-button">
                      <span>Discounts</span>
                      <span>₹0.00</span>
                    </div>
                  </div>
                  <div className="bottom">
                    <h5 className="d-flex justify-content-between">
                      <span>Total</span>
                      <span className="total-price-checkout">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
