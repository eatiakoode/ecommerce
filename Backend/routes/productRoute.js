const express = require("express");
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
  getProductsByCategory,
  getProductBySlug, // <-- import the new controller
} = require("../controller/productCtrl");
 
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
 
// ==============================
// 🗂️ Multer Configuration (CSV)
// ==============================
const multer = require("multer");
const path = require("path");
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imports/"); // CSV files will go to /imports
  },
  filename: (req, file, cb) => {
    cb(null, "import_" + Date.now() + path.extname(file.originalname));
  },
});
const csvUpload = multer({ storage: csvStorage });
 
// ==============================
// 📦 Product Routes
// ==============================
 
// ✅ Import Products via CSV
// POST: /api/product/import
router.post(
  "/import",
  authMiddleware,
  isAdmin,
  csvUpload.single("file"),
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
router.post(
  "/create",
  authMiddleware,
  isAdmin,
  upload.array("images", 10), // use shared upload middleware for images
  createProduct
);
 
// ✅ Get All Products
// GET: /api/product/
router.get("/",authMiddleware,isAdmin, getAllProduct);
 
// ✅ Get Single Product by ID
// GET: /api/product/:id
// router.get("/:id",authMiddleware,isAdmin, getaProduct);
 
// ✅ Update Product
// PUT: /api/product/:id
router.put("/:id", authMiddleware, isAdmin,upload.array("images",10), updateProduct);
 
// ✅ Delete Product
// DELETE: /api/product/:id
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
 
// ✅ Add to Wishlist
// PUT: /api/product/wishlist
router.put("/wishlist", authMiddleware, addToWishlist);
 
// ✅ Product Rating
// PUT: /api/product/rating
router.put("/rating", authMiddleware,isAdmin, rating);

router.get("/category/:categoryId",authMiddleware,isAdmin, getProductsByCategory);
 
// ✅ Get Product by Slug
router.get("/slug/:slug", authMiddleware, isAdmin, getProductBySlug);
 
module.exports = router;