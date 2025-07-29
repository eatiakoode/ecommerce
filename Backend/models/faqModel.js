//  const mongoose = require("mongoose");

// const FAQ_TYPES = ["how to buy", "exchange and return", "refund question"];

// const faqSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Title is required"],
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required"],
//     },
//     type: {
//       type: String,
//       enum: {
//         values: FAQ_TYPES,
//         message:
//           "type must be one of: 'how to buy', 'exchange and return', 'refund question'",
//       },
//       required: [true, "Type is required"],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("FAQ", faqSchema);
// module.exports.FAQ_TYPES = FAQ_TYPES; // export for reuse if you want

// backend/model/faqModel.js

// const mongoose = require("mongoose");
// const slugify = require("slugify");
// const faqSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: ["how to buy", "exchange and return", "refund question"],
//       required: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// // Generate slug from type before saving

// faqSchema.pre("save", function (next) {
//   this.slug = slugify(this.type, { lower: true });
//   next();
// });
 
// // If updating the type, also update the slug

// faqSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.type) {
//     update.slug = slugify(update.type, { lower: true });
//     this.setUpdate(update);
//   }
//   next();
// });
// module.exports = mongoose.model("FAQ", faqSchema);

const mongoose = require("mongoose");
const slugify = require("slugify");
 
const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["how-to-buy", "exchange-and-return", "refund-question"],
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
 
// Generate slug from type before saving
// faqSchema.pre("save", function (next) {
//   this.slug = slugify(this.type, { lower: true });
//   next();
// });
 
// // If updating the type, also update the slug
// faqSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   if (update.type) {
//     update.slug = slugify(update.type, { lower: true });
//     this.setUpdate(update);
//   }
//   next();
// });
 
module.exports = mongoose.model("FAQ", faqSchema);