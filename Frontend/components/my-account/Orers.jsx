"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserOrders } from "@/api/auth";

export default function Orers() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getUserOrders(token);
        if (result.success) {
          setOrders(result.data || []);
        } else {
          setError(result.error || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const getTotalItems = (orderItems) => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
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

  if (loading) {
    return (
      <div className="my-account-content">
        <div className="account-orders">
          <div className="wrap-account-order">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content">
        <div className="account-orders">
          <div className="wrap-account-order">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="tf-btn btn-fill radius-4"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="my-account-content">
        <div className="account-orders">
          <div className="wrap-account-order">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No orders found</p>
              <Link href="/" className="tf-btn btn-fill radius-4">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content">
      <div className="account-orders">
        <div className="wrap-account-order">
          <table>
            <thead>
              <tr>
                <th className="fw-6">Order</th>
                <th className="fw-6">Date</th>
                <th className="fw-6">Status</th>
                <th className="fw-6">Total</th>
                <th className="fw-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalItems = getTotalItems(order.orderItems);
                const itemText = totalItems === 1 ? 'item' : 'items';
                
                return (
                  <tr key={order._id} className="tf-order-item">
                    <td>#{order.invoiceNo}</td>
                    <td>{formatDate(order.orderTime)}</td>
                    <td>
                      <span className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{formatCurrency(order.amount)} for {totalItems} {itemText}</td>
                    <td>
                      <Link
                        href={`/my-account-orders-details/${order._id}`}
                        className="tf-btn btn-fill radius-4"
                      >
                        <span className="text">View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
