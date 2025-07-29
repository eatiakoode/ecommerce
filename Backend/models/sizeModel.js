const mongoose = require("mongoose");
const slugify = require("slugify");

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
    slug: {
      type: String,
      unique: true,
    },
    // SKU: {
    //   type: String,
    //   required: [true, "SKU is required"],
    //   unique: true,
    //   trim: true,
    // },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-create slug before saving
sizeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Size", sizeSchema);
