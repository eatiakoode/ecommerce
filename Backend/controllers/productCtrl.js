const Product = require("../model/productModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
 
// ✅ Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Get a Product by ID
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id).populate("color");
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Get All Products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
 
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
 
    let query = Product.find(JSON.parse(queryStr));
 
    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }
 
    // Field limiting
    if (req.query.fields) {
      query = query.select(req.query.fields.split(",").join(" "));
    } else {
      query = query.select("-__v");
    }
 
    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
 
    if (req.query.page) {
      const total = await Product.countDocuments();
      if (skip >= total) throw new Error("This page does not exist");
    }
 
    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Add/Remove from Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
 
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
 
    let updatedUser;
    if (alreadyAdded) {
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },
        { new: true }
      );
    }
 
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Rating a Product
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
 
  try {
    const product = await Product.findById(prodId);
    const alreadyRated = product.ratings.find(
      (r) => r.postedby.toString() === _id.toString()
    );
 
    if (alreadyRated) {
      await Product.updateOne(
        { "ratings._id": alreadyRated._id },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.comment": comment,
          },
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star,
              comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
 
    const updatedProduct = await Product.findById(prodId);
    const totalRating = updatedProduct.ratings.length;
    const sumRating = updatedProduct.ratings.reduce((acc, r) => acc + r.star, 0);
    const averageRating = Math.round(sumRating / totalRating);
 
    updatedProduct.totalrating = averageRating;
    await updatedProduct.save();
 
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});
 
// ✅ Import Products from CSV
const importProductsFromCSV = asyncHandler(async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "CSV file is required" });
 
    const filePath = req.file.path;
    const products = [];
 
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const product = {
            title: row.title?.trim(),
            slug: row.slug?.toLowerCase().trim(),
            description: row.description,
            price: parseFloat(row.price),
            category: row.category,
            brand: row.brand,
            quantity: parseInt(row.quantity),
            sold: parseInt(row.sold || 0),
            tags: row.tags,
          };
 
          if (row.images) product.images = JSON.parse(row.images);
          if (row.color) product.color = JSON.parse(row.color);
 
          products.push(product);
        } catch (err) {
          console.log("Row parse error:", err.message);
        }
      })
      .on("end", async () => {
        try {
          const inserted = await Product.insertMany(products);
          res.status(201).json({
            message: "Products imported successfully.",
            count: inserted.length,
          });
        } catch (err) {
          res.status(500).json({ error: "Insert error", details: err.message });
        }
      });
  } catch (err) {
    res.status(500).json({ error: "CSV import failed", details: err.message });
  }
});
 
// ✅ Export Products to CSV
const exportProductsToCSV = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().lean();
 
    if (!products.length) {
      return res.status(404).json({ error: "No products to export." });
    }
 
    const fields = ["title", "slug", "description", "price", "category", "brand", "quantity", "sold", "tags"];
    const parser = new Parser({ fields });
    const csvData = parser.parse(products);
 
    const exportPath = path.join(__dirname, "../exports/exportProducts.csv");
    fs.writeFileSync(exportPath, csvData);
 
    res.download(exportPath, "exportProducts.csv");
  } catch (err) {
    res.status(500).json({ error: "CSV export failed", details: err.message });
  }
});
 
// ✅ Bulk Edit Products
const bulkEditProducts = asyncHandler(async (req, res) => {
  try {
    const updates = req.body;
 
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array." });
    }
 
    const bulkOps = updates.map((product) => {
      if (!product._id) return null;
 
      const updateFields = { ...product };
      delete updateFields._id;
 
      if (updateFields.title) {
        updateFields.slug = slugify(updateFields.title);
      }
 
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $set: updateFields },
        },
      };
    }).filter(Boolean);
 
    if (bulkOps.length === 0) {
      return res.status(400).json({ error: "No valid updates provided." });
    }
 
    const result = await Product.bulkWrite(bulkOps);
    res.status(200).json({ message: "Bulk update successful", result });
  } catch (err) {
    res.status(500).json({ error: "Bulk update failed", details: err.message });
  }
});
 
// ✅ Export All Functions
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getaProduct,
  getAllProduct,
  addToWishlist,
  rating,
  importProductsFromCSV,
  exportProductsToCSV,
  bulkEditProducts,
};