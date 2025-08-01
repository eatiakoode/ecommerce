"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Image from "next/image";
import { formatToINR } from "@/utils/currencyConverter";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safe rendering function to handle objects properly
  const safeRender = (value, fallback = "N/A") => {
    if (!value) return fallback;
    if (typeof value === "object") {
      // Handle array of objects (like color options)
      if (Array.isArray(value)) {
        // Return the first item's name/title if it's an array of objects
        if (value.length > 0 && typeof value[0] === "object") {
          return value[0].name || value[0].title || value[0].value || fallback;
        }
        return value[0] || fallback;
      }
      // Handle single object
      return value.name || value.title || value.value || fallback;
    }
    return String(value);
  };

  // Enhanced function to handle color and size specifically
  const renderColorOrSize = (value, type = "value") => {
    if (!value) return "N/A";
    
    // If it's already a string, return it
    if (typeof value === "string") {
      return value;
    }
    
    // If it's an object, try to get the name/title/value
    if (typeof value === "object") {
      return value.name || value.title || value.value || "N/A";
    }
    
    // If it's an array, get the first item
    if (Array.isArray(value)) {
      if (value.length === 0) return "N/A";
      const firstItem = value[0];
      if (typeof firstItem === "object") {
        return firstItem.name || firstItem.title || firstItem.value || "N/A";
      }
      return String(firstItem);
    }
    
    return String(value);
  };

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const invoiceNo = searchParams.get("invoiceNo");

    if (orderId && invoiceNo) {
      const savedOrderDetails = localStorage.getItem("lastOrderDetails");
      
      if (savedOrderDetails) {
        try {
          const parsed = JSON.parse(savedOrderDetails);
          setOrderDetails(parsed);
        } catch (error) {
          console.error("Error parsing order details:", error);
        }
      }
    }
    setLoading(false);
  }, [searchParams]);

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ Thank You Message */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Thank You!</h1>
            <p className="text-gray-600 text-xs">Your order was placed successfully. A confirmation email is on its way.</p>
          </div>

          {/* ✅ Order + Shipping Info */}
          <div className="bg-white rounded-lg shadow-md mb-3">
            <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x">
              {/* Order Info */}
              <div className="p-3">
                <h2 className="text-sm font-semibold text-blue-600 mb-2">Order Details</h2>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li className="flex justify-between"><span>Order ID:</span><span>{safeRender(orderDetails?.orderId)}</span></li>
                  <li className="flex justify-between"><span>Invoice No:</span><span>{safeRender(orderDetails?.invoiceNo)}</span></li>
                  <li className="flex justify-between"><span>Order Date:</span><span>{orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString() : new Date().toLocaleDateString()}</span></li>
                  <li className="flex justify-between"><span>Payment:</span><span className="text-green-600 font-medium">Cash on Delivery</span></li>
                  <li className="flex justify-between font-semibold"><span>Total:</span><span>{orderDetails?.amount ? formatToINR(orderDetails.amount) : "₹0.00"}</span></li>
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="p-3">
                <h2 className="text-sm font-semibold text-blue-600 mb-2">Shipping Info</h2>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li><strong>Name:</strong> {safeRender(orderDetails?.firstname)} {safeRender(orderDetails?.lastname)}</li>
                  <li><strong>Address:</strong> {safeRender(orderDetails?.address)}</li>
                  <li><strong>City:</strong> {safeRender(orderDetails?.city)}</li>
                  <li><strong>State:</strong> {safeRender(orderDetails?.state)}</li>
                  <li><strong>Pincode:</strong> {safeRender(orderDetails?.pincode)}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ✅ Ordered Items */}
          {orderDetails?.items?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md mb-3">
              <div className="p-3 border-b">
                <h2 className="text-sm font-semibold text-blue-600">Order Items</h2>
              </div>
              <div className="p-3 space-y-2">
                {orderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 border p-2 rounded-md hover:shadow-sm">
                    <div className="w-8 h-8 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                      {item.image && item.image.trim() !== "" ? (
                        <Image src={item.image} alt={item.name} width={32} height={32} className="object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-900">{safeRender(item.name)}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">Size: {renderColorOrSize(item.size || item.selectedSize)}</p>
                      <p className="text-xs text-gray-500">Color: {renderColorOrSize(item.color || item.selectedColor)}</p>
                    </div>
                    <div className="text-xs font-semibold text-gray-800">
                      {formatToINR(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Next Steps */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ol className="space-y-1 text-xs text-blue-900">
              <li className="flex items-start space-x-1">
                <span className="text-white bg-blue-600 rounded-full w-3 h-3 flex items-center justify-center text-xs font-bold">1</span>
                <span>You'll receive a confirmation email with order details.</span>
              </li>
              <li className="flex items-start space-x-1">
                <span className="text-white bg-blue-600 rounded-full w-3 h-3 flex items-center justify-center text-xs font-bold">2</span>
                <span>Your order will be processed shortly.</span>
              </li>
              <li className="flex items-start space-x-1">
                <span className="text-white bg-blue-600 rounded-full w-3 h-3 flex items-center justify-center text-xs font-bold">3</span>
                <span>We'll notify you about delivery updates.</span>
              </li>
            </ol>
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              onClick={handleGoHome}
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded-md font-medium hover:bg-blue-600 hover:text-white transition text-xs"
            >
              Continue Shopping
            </button>
            <Link href="/my-account-orders" className="px-3 py-1 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition text-center text-xs">
              View My Orders
            </Link>
            <Link href="/my-account" className="px-3 py-1 bg-gray-700 text-white rounded-md font-medium hover:bg-gray-800 transition text-center text-xs">
              My Dashboard
            </Link>
          </div>
        </div>
      </div>

      <Footer1 hasPaddingBottom />
    </>
  );
};

export default ThankYouPage;
