const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
 
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  importProductsFromCSV,
  exportProductsToCSV,
  bulkEditProducts,
} = require("../controllers/productCtrl");
 
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
 
// ==============================
// 🗂️ Multer Configuration (CSV)
// ==============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imports/"); // CSV files will go to /imports
  },
  filename: (req, file, cb) => {
    cb(null, "import_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
 
// ==============================
// 📦 Product Routes
// ==============================
 
// ✅ Import Products via CSV
// POST: /api/product/import
router.post(
  "/import",
  authMiddleware,
  isAdmin,
  upload.single("file"),
  importProductsFromCSV
);
 
// ✅ Export Products to CSV
// GET: /api/product/export
router.get("/export", authMiddleware, isAdmin, exportProductsToCSV);
 
// ✅ Bulk Edit Products
// PUT: /api/product/bulk-edit
router.put("/bulk-edit", authMiddleware, isAdmin, bulkEditProducts);
 
// ✅ Create a Product
// POST: /api/product/
router.post("/", authMiddleware, isAdmin, createProduct);
 
// ✅ Get All Products
// GET: /api/product/
router.get("/", getAllProduct);
 
// ✅ Get Single Product by ID
// GET: /api/product/:id
router.get("/:id", getaProduct);
 
// ✅ Update Product
// PUT: /api/product/:id
router.put("/:id", authMiddleware, isAdmin, updateProduct);
 
// ✅ Delete Product
// DELETE: /api/product/:id
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
 
// ✅ Add to Wishlist
// PUT: /api/product/wishlist
router.put("/wishlist", authMiddleware, addToWishlist);
 
// ✅ Product Rating
// PUT: /api/product/rating
router.put("/rating", authMiddleware, rating);
 
module.exports = router;