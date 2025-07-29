const mongoose = require("mongoose");
 
const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Brand", brandSchema);