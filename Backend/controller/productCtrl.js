const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
 
// Utility to flatten and sanitize array fields
function sanitizeObjectIdArray(arr) {
  if (!arr) return [];
  if (typeof arr === 'string') {
    try {
      const parsed = JSON.parse(arr);
      if (Array.isArray(parsed)) return parsed.flat(Infinity).filter(Boolean);
      return [parsed];
    } catch {
      return [arr];
    }
  }
  if (Array.isArray(arr)) return arr.flat(Infinity).filter(Boolean);
  return [arr];
}

// ✅ Create Product
// const createProduct = asyncHandler(async (req, res) => {
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }
//     const newProduct = await Product.create(req.body);
//     res.json(newProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const createProduct = asyncHandler(async (req, res) => {
//   const { title, description, price, category, brand, quantity, color, tags, isActive } = req.body;

//   if (!req.files || req.files.length === 0) {
//     res.status(400);
//     throw new Error("At least one image file is required");
//   }

//   const slug = title ? slugify(title) : "";
  
//   const images = req.files.map((file) => ({
//     public_id: file.filename,
//     url:`/uploads/${file.filename}`,
//   }));      

//   const product = await Product.create({
//     title,
//     slug,
//     description,
//     price,
//     category,
//     brand,
//     quantity,
//     images,
//     color,
//     tags,
//     isActive,
//   });

//   res.status(201).json(product);
// });

// module.exports = { createProduct };

const createProduct = asyncHandler(async (req, res) => {
  try {
    let {
      title,
      shortDescription,
      longDescription,
      SKU,
      MRP,
      sellingPrice,
      categories,
      brand,
      quantity,
      color,
      size,
      tags,
    } = req.body;

    // Defensive: sanitize arrays
    color = sanitizeObjectIdArray(color);
    size = sanitizeObjectIdArray(size);
    categories = sanitizeObjectIdArray(categories);

    // Slugify title if provided
    const slug = title ? slugify(title, { lower: true }) : "";

    // Validate required fields
    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !SKU ||
      !MRP ||
      !sellingPrice ||
      !categories ||
      !brand ||
      !quantity
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image file is required" });
    }

    // Map uploaded files to images array
    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: `/uploads/${file.filename}`,
    }));

    const product = await Product.create({
      title,
      slug,
      shortDescription,
      longDescription,
      SKU,
      MRP,
      sellingPrice,
      categories,
      brand,
      quantity,
      images,
      color,
      size,
      tags,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Product creation failed");
  }
});

 
// ✅ Update Product
// const updateProduct = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     if (req.body.title) {
//       req.body.slug = slugify(req.body.title);
//     }
//     const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.json(updatedProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    let product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Slugify if title is being updated
    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true });
    }

    // Defensive: sanitize arrays
    if (req.body.color) req.body.color = sanitizeObjectIdArray(req.body.color);
    if (req.body.size) req.body.size = sanitizeObjectIdArray(req.body.size);
    if (req.body.categories) req.body.categories = sanitizeObjectIdArray(req.body.categories);

    const updateData = {
      ...req.body,
    };

    // If new images uploaded, replace the old ones
    if (req.files && req.files.length > 0) {
      // Delete old images from filesystem
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          const oldImagePath = path.join(__dirname, `../${img.url}`);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        });
      }

      // Add new images
      const newImages = req.files.map((file) => ({
        public_id: file.filename,
        url: `/uploads/${file.filename}`,
      }));

      updateData.images = newImages;
    }

    // Update the product
    product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Product update failed");
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
    const product = await Product.findById(id)
      .populate('categories')
      .populate('brand')
      .populate('color')
      .populate('size');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch product' });
  }
});
 
// ✅ Get All Products
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categories')
      .populate('brand')
      .populate('color')
      .populate('size');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
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
// const importProductsFromCSV = asyncHandler(async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "CSV file is required" });
 
//     const filePath = req.file.path;
//     const products = [];
 
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (row) => {
//         try {
//           const product = {
//             title: row.title?.trim(),
//             slug: row.slug?.toLowerCase().trim(),
//             description: row.description,
//             price: parseFloat(row.price),
//             category: row.category,
//             brand: row.brand,
//             quantity: parseInt(row.quantity),
//             sold: parseInt(row.sold || 0),
//             tags: row.tags,
//           };
 
//           if (row.images) product.images = JSON.parse(row.images);
//           if (row.color) product.color = JSON.parse(row.color);
 
//           products.push(product);
//         } catch (err) {
//           console.log("Row parse error:", err.message);
//         }
//       })
//       .on("end", async () => {
//         try {
//           const inserted = await Product.insertMany(products);
//           res.status(201).json({
//             message: "Products imported successfully.",
//             count: inserted.length,
//           });
//         } catch (err) {
//           res.status(500).json({ error: "Insert error", details: err.message });
//         }
//       });
//   } catch (err) {
//     res.status(500).json({ error: "CSV import failed", details: err.message });
//   }
// });
 
// // ✅ Export Products to CSV
// const exportProductsToCSV = asyncHandler(async (req, res) => {
//   try {
//     const products = await Product.find().lean();
 
//     if (!products.length) {
//       return res.status(404).json({ error: "No products to export." });
//     }
 
//     const fields = ["title", "slug", "description", "price", "category", "brand", "quantity", "sold", "tags"];
//     const parser = new Parser({ fields });
//     const csvData = parser.parse(products);
 
//     const exportPath = path.join(__dirname, "../exports/exportProducts.csv");
//     fs.writeFileSync(exportPath, csvData);
 
//     res.download(exportPath, "exportProducts.csv");
//   } catch (err) {
//     res.status(500).json({ error: "CSV export failed", details: err.message });
//   }
// });
 
// // ✅ Bulk Edit Products
// const bulkEditProducts = asyncHandler(async (req, res) => {
//   try {
//     const updates = req.body;
 
//     if (!Array.isArray(updates) || updates.length === 0) {
//       return res.status(400).json({ error: "Request body must be a non-empty array." });
//     }
 
//     const bulkOps = updates.map((product) => {
//       if (!product._id) return null;
 
//       const updateFields = { ...product };
//       delete updateFields._id;
 
//       if (updateFields.title) {
//         updateFields.slug = slugify(updateFields.title);
//       }
 
//       return {
//         updateOne: {
//           filter: { _id: product._id },
//           update: { $set: updateFields },
//         },
//       };
//     }).filter(Boolean);
 
//     if (bulkOps.length === 0) {
//       return res.status(400).json({ error: "No valid updates provided." });
//     }
 
//     const result = await Product.bulkWrite(bulkOps);
//     res.status(200).json({ message: "Bulk update successful", result });
//   } catch (err) {
//     res.status(500).json({ error: "Bulk update failed", details: err.message });
//   }
// });

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
            slug: slugify(row.title?.trim()),
            shortDescription: row.shortDescription,
            longDescription: row.longDescription,
            mrp: parseFloat(row.mrp),
            price: parseFloat(row.price),
            categories: JSON.parse(row.categories || "[]"),
            brand: row.brand,
            quantity: parseInt(row.quantity),
            sold: parseInt(row.sold || 0),
            tags: row.tags,
            sku: row.sku,
          };

          if (row.images) product.images = JSON.parse(row.images);
          if (row.colors) product.colors = JSON.parse(row.colors);
          if (row.sizes) product.sizes = JSON.parse(row.sizes);

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

    const fields = [
      "title",
      "slug",
      "shortDescription",
      "longDescription",
      "mrp",
      "price",
      "categories",
      "brand",
      "quantity",
      "sold",
      "tags",
      "sku",
    ];
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


const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const limit = parseInt(req.query.limit) || 8;
  const skip = parseInt(req.query.skip) || 0;

  const products = await Product.find({ categories: categoryId })
    .limit(limit)
    .skip(skip);

  res.status(200).json(products);
});

// ✅ Get Product by Slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug })
      .populate('categories')
      .populate('color')
      .populate('size');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch product by slug' });
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
  getProductsByCategory,
  getProductBySlug, // <-- export the new controller
};