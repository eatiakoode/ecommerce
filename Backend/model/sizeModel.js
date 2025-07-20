const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Size name is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Size value is required"],
    },
    type: {
      type: String,
      required: [true, "Size type is required"], // like shirt, pants, shoes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Size", sizeSchema);
