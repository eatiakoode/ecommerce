const mongoose = require("mongoose");

// Product Schema Definition
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    MRP: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    categories: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    // images: [
    //   {
    //     public_id: { type: String },
    //     url: { type: String },
    //   },
    // ],
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
    color: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color",
      },
    ],
    size: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
      },
    ],
    tags: {
      type: String,
    },
    //   ratings: [
    //     {
    //       star: { type: Number },
    //       comment: { type: String },
    //       postedby: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User",
    //       },
    //     },
    //   ],
    //   totalrating: {
    //     type: Number,
    //     default: 0,
    //   },
  },
  {
    timestamps: true,
  }
);

// Export Model
module.exports = mongoose.model("Product", productSchema);