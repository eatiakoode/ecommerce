// const mongoose = require("mongoose"); // Erase if already required

// // Declare the Schema of the Mongo model
// var blogSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "BCategory",
//       required: true,
//     },
//     // link: {
//     //   type: String,
//     //   required: true,
//     // },
//     numViews: {
//       type: Number,
//       default: 0,
//     },
//     isLiked: {
//       type: Boolean,
//       default: false,
//     },
//     isDisliked: {
//       type: Boolean,
//       default: false,
//     },
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     dislikes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     author: {
//       type: String,
//     },
//     date: {
//       type : Date,
//       required : true,
//     },
//     images: [
//       {
//         public_id: { type: String },
//         url: { type: String },
//       },
//     ],
//   },
//   {
//     toJSON: {
//       virtuals: true,
//     },
//     toObject: {
//       virtuals: true,
//     },
//     timestamps: true,
//   }
// );

// //Export the model
// module.exports = mongoose.model("Blog", blogSchema);

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BCategory",
      required: [true, "Blog category is required"],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Publish date is required"],
    },
    images: [
      {
        public_id: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
