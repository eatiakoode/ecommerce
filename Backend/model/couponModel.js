const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "inactive",
  },
}, {
  timestamps: true,
});

// Export the model
module.exports = mongoose.model("Coupon", couponSchema);