const mongoose = require("mongoose");

// Define the schema for orders
const orderSchema = new mongoose.Schema(
  {
    invoiceNo: { type: Number, required: true, unique: true },
    orderTime: { type: Date, required: true },
    customerName: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Netbanking"],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Ordered", "Pending", "Processing", "Delivered", "Cancelled", "Failed"],
      default: "Ordered",
    },
    action: { type: String, default: "" },

    // Extra fields for dashboard/stats compatibility
    paidAt: { type: Date },
    month: { type: Number },
    totalPrice: { type: Number },
    totalPriceAfterDiscount: { type: Number },
    orderStatus: {
      type: String,
      enum: ["Ordered", "Pending", "Processing", "Delivered", "Cancelled", "Failed"],
      default: "Ordered",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shippingInfo: {
      firstname: { type: String },
      lastname: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      other: { type: String },
      pincode: { type: Number },
    },
    paymentInfo: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        color: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Color",
        },
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Size", 
        },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
