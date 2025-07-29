const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const csv = require("csv-parser");

// Create category
// const createCategory = asyncHandler(async (req, res) => {
//   const { name, description,image,  isActive } = req.body;
//   const category = await Category.create({ name, description,image, isActive });
//   res.status(201).json(category);
// });

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  // const imagePath = `/images/categories/${req.file.filename}`; 
  const imagePath = `/uploads/${req.file.filename}`;
  console.log("Filename: ", req.file.filename); ``

  const category = await Category.create({
    name,
    description,
    image: imagePath,
    isActive,
  });

  res.status(201).json(category);
});


// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Get single category
// const getCategory = asyncHandler(async (req, res) => {
//   const category = await Category.findById(req.params.id);
//   if (!category) {
//     res.status(404);
//     throw new Error("Category not found");
//   }
//   res.json(category);
// });

const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // const products = await Product.find({ category: category._id });
  // const productCount = await Product.countDocuments({ category: category._id });
  const products = await Product.find({ categories: category._id });
  const productCount = await Product.countDocuments({ categories: category._id });


  res.json({
    ...category._doc, // converts Mongoose doc to plain JS object
    products,
    totalItems: productCount,
  });
});

// Update category
// const updateCategory = asyncHandler(async (req, res) => {
//   const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   if (!category) {
//     res.status(404);
//     throw new Error("Category not found");
//   }
//   res.json(category);
// });

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const updateData = {
    ...req.body,
  };

  if (req.file) {

    const oldImagePath = path.join(__dirname, `../${category.image}`);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    updateData.image = `/uploads/${req.file.filename}`;
  }

  category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  res.json(category);
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ message: "Category deleted" });
});

// Export categories to CSV
const exportCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  const fields = ["_id", "name", "description", "isActive", "createdAt", "updatedAt"];
  const json2csvParser = new Parser({ fields });
  const csvData = json2csvParser.parse(categories);

  const exportPath = "exports/categories.csv";
  fs.writeFileSync(exportPath, csvData);
  res.download(exportPath);
});

// Import categories from CSV
const importCategories = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      results.push({
        name: data.name,
        description: data.description,
        isActive: data.isActive && data.isActive.toLowerCase() === "true",
      });
    })
    .on("end", async () => {
      try {
        const inserted = [];

        for (const item of results) {
          const exists = await Category.findOne({ name: item.name });
          if (!exists) {
            inserted.push(item);
          }
        }

        await Category.insertMany(inserted);
        res.json({ status: "success", message: `${inserted.length} categories imported successfully` });
      } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
      }
    })
    .on("error", (err) => {
      res.status(500).json({ status: "fail", message: err.message });
    });
});

// Bulk delete
const bulkDeleteCategories = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ status: "fail", message: "Invalid IDs array" });
  }

  await Category.deleteMany({ _id: { $in: ids } });
  res.json({ status: "success", message: "Categories deleted successfully" });
});

// Bulk edit
const bulkEditCategories = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ status: "fail", message: "Invalid updates array" });
  }

  for (let update of updates) {
    const { _id, ...fields } = update;
    await Category.findByIdAndUpdate(_id, fields);
  }

  res.json({ status: "success", message: "Categories updated successfully" });
});

// ✅ Paginated listing with filter by name
const getPaginatedCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const query = {
    name: { $regex: search, $options: "i" }, // case-insensitive search
  };

  const categories = await Category.find(query).skip(skip).limit(limit);
  const total = await Category.countDocuments(query);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    categories,
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  exportCategories,
  importCategories,
  bulkDeleteCategories,
  bulkEditCategories,
  getPaginatedCategories,
};
