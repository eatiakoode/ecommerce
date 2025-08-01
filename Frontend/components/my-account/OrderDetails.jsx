"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getOrderDetails } from "@/api/auth";
import Link from "next/link";

export default function OrderDetails({ orderId }) {
  const { user, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !user || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getOrderDetails(token, orderId);
        
        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.error || "Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-orange-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="wd-form-order">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="wd-form-order">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/my-account-orders" className="tf-btn btn-fill radius-4">
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="my-account-content">
        <div className="account-order-details">
          <div className="wd-form-order">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Order not found</p>
              <Link href="/my-account-orders" className="tf-btn btn-fill radius-4">
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstProduct = order.orderItems?.[0]?.product;
  const shippingInfo = order.shippingInfo;

  // Helper function to get a valid image URL
  const getValidImageUrl = (product) => {
    if (!product) return "/images/products/womens/women-1.jpg";
    
    // Check if product has images array and first image exists
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    
    // Check if product has a single image property
    if (product.image) {
      return product.image;
    }
    
    // Default fallback
    return "/images/products/womens/women-1.jpg";
  };

  // Helper function to check if image URL is valid
  const isValidImageUrl = (url) => {
    // Check if url is a string and not empty
    if (typeof url !== 'string' || !url) {
      return false;
    }
    
    const trimmedUrl = url.trim();
    return trimmedUrl !== "" && trimmedUrl !== "null" && trimmedUrl !== "undefined";
  };

  // Get the image URL for the first product
  const firstProductImageUrl = getValidImageUrl(firstProduct);

  return (
    <div className="my-account-content">
      <div className="account-order-details">
        <div className="wd-form-order">
          <div className="order-head">
            <figure className="img-product">
              {isValidImageUrl(firstProductImageUrl) && (
                <Image
                  alt="product"
                  src={firstProductImageUrl}
                  width={600}
                  height={800}
                />
              )}
            </figure>
            <div className="content">
              <div className={`badge ${getStatusColor(order.orderStatus)}`}>
                {getStatusBadge(order.orderStatus)}
              </div>
              <h6 className="mt_8 fw-5">Order #{order.invoiceNo}</h6>
            </div>
          </div>
          <div className="tf-grid-layout md-col-2 gap-15">
            <div className="item">
              <div className="text-2 text_black-2">Order Date</div>
              <div className="text-2 mt_4 fw-6">{formatDate(order.orderTime)}</div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Payment Method</div>
              <div className="text-2 mt_4 fw-6">{order.paymentMethod}</div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Order Status</div>
              <div className={`text-2 mt_4 fw-6 ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Total Amount</div>
              <div className="text-2 mt_4 fw-6">{formatCurrency(order.amount)}</div>
            </div>
          </div>
          <div className="widget-tabs style-3 widget-order-tab">
            <ul className="widget-menu-tab">
              <li
                className={`item-title ${activeTab == 1 ? "active" : ""} `}
                onClick={() => setActiveTab(1)}
              >
                <span className="inner">Order Summary</span>
              </li>
              <li
                className={`item-title ${activeTab == 2 ? "active" : ""} `}
                onClick={() => setActiveTab(2)}
              >
                <span className="inner">Item Details</span>
              </li>
              <li
                className={`item-title ${activeTab == 3 ? "active" : ""} `}
                onClick={() => setActiveTab(3)}
              >
                <span className="inner">Shipping Info</span>
              </li>
              <li
                className={`item-title ${activeTab == 4 ? "active" : ""} `}
                onClick={() => setActiveTab(4)}
              >
                <span className="inner">Payment Info</span>
              </li>
            </ul>
            <div className="widget-content-tab">
              <div
                className={`widget-content-inner ${
                  activeTab == 1 ? "active" : ""
                } `}
              >
                <div className="widget-timeline">
                  <ul className="timeline">
                    <li>
                      <div className="timeline-badge success" />
                      <div className="timeline-box">
                        <a className="timeline-panel" href="#">
                          <div className="text-2 fw-6">Order Placed</div>
                          <span>{formatDate(order.orderTime)}</span>
                        </a>
                        <p>
                          <strong>Order Number : </strong>#{order.invoiceNo}
                        </p>
                        <p>
                          <strong>Payment Method : </strong>{order.paymentMethod}
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className={`timeline-badge ${order.orderStatus === 'Processing' || order.orderStatus === 'Delivered' ? 'success' : ''}`} />
                      <div className="timeline-box">
                        <a className="timeline-panel" href="#">
                          <div className="text-2 fw-6">Order Processing</div>
                          <span>{order.orderStatus === 'Processing' || order.orderStatus === 'Delivered' ? formatDate(order.orderTime) : 'Pending'}</span>
                        </a>
                        <p>
                          <strong>Status : </strong>{order.orderStatus}
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className={`timeline-badge ${order.orderStatus === 'Delivered' ? 'success' : ''}`} />
                      <div className="timeline-box">
                        <a className="timeline-panel" href="#">
                          <div className="text-2 fw-6">Order Delivered</div>
                          <span>{order.orderStatus === 'Delivered' ? formatDate(order.orderTime) : 'Pending'}</span>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`widget-content-inner ${
                  activeTab == 2 ? "active" : ""
                } `}
              >
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="order-head mb-4">
                    <figure className="img-product">
                      {isValidImageUrl(getValidImageUrl(item.product)) && (
                        <Image
                          alt="product"
                          src={getValidImageUrl(item.product)}
                          width={600}
                          height={800}
                        />
                      )}
                    </figure>
                    <div className="content">
                      <div className="text-2 fw-6">{item.product?.title || 'Product'}</div>
                      <div className="mt_4">
                        <span className="fw-6">Price :</span> {formatCurrency(item.price)}
                      </div>
                      <div className="mt_4">
                        <span className="fw-6">Quantity :</span> {item.quantity}
                      </div>
                      {item.color && (
                        <div className="mt_4">
                          <span className="fw-6">Color :</span> {item.color.title}
                        </div>
                      )}
                      {item.size && (
                        <div className="mt_4">
                          <span className="fw-6">Size :</span> {item.size.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Subtotal</span>
                    <span className="fw-6">{formatCurrency(order.totalPrice || order.amount)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_4 pb_8 line-bt">
                    <span>Discount</span>
                    <span className="fw-6">{formatCurrency((order.totalPrice || order.amount) - order.amount)}</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Order Total</span>
                    <span className="fw-6">{formatCurrency(order.amount)}</span>
                  </li>
                </ul>
              </div>
              <div
                className={`widget-content-inner ${
                  activeTab == 3 ? "active" : ""
                } `}
              >
                {shippingInfo ? (
                  <div>
                    <h6 className="mb-4">Shipping Information</h6>
                    <div className="shipping-details">
                      <p><strong>Name:</strong> {shippingInfo.firstname} {shippingInfo.lastname}</p>
                      <p><strong>Address:</strong> {shippingInfo.address}</p>
                      <p><strong>City:</strong> {shippingInfo.city}</p>
                      <p><strong>State:</strong> {shippingInfo.state}</p>
                      <p><strong>Pincode:</strong> {shippingInfo.pincode}</p>
                      {shippingInfo.other && (
                        <p><strong>Additional Info:</strong> {shippingInfo.other}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No shipping information available</p>
                )}
              </div>
              <div
                className={`widget-content-inner ${
                  activeTab == 4 ? "active" : ""
                } `}
              >
                <p className="text-2 text-success">
                  Thank you! Your order has been received
                </p>
                <ul className="mt_20">
                  <li>
                    Order Number : <span className="fw-7">#{order.invoiceNo}</span>
                  </li>
                  <li>
                    Date : <span className="fw-7">{formatDate(order.orderTime)}</span>
                  </li>
                  <li>
                    Total : <span className="fw-7">{formatCurrency(order.amount)}</span>
                  </li>
                  <li>
                    Payment Method : <span className="fw-7">{order.paymentMethod}</span>
                  </li>
                  <li>
                    Status : <span className="fw-7">{order.orderStatus}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
