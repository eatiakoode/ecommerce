const mongoose = require("mongoose");

const FAQ_TYPES = ["how to buy", "exchange and return", "refund question"];

const faqSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: FAQ_TYPES,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FAQ", faqSchema);
module.exports.FAQ_TYPES = FAQ_TYPES;
