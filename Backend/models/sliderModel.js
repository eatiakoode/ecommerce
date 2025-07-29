const mongoose = require("mongoose");
 
const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // buttonText: {
    //   type: String,
    //   default: "Explore Collection",
    // },
  },
  {
    timestamps: true,
  }
);
 
module.exports = mongoose.model("Slider", sliderSchema);