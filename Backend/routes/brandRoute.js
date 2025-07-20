const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  bulkDeleteBrands,
  bulkEditBrands,
  importBrands,
  exportBrands,
} = require("../controllers/brandCtrl");

// 📦 CSV Import/Export Routes
router.get("/export", exportBrands);
router.post("/import", upload.single("file"), importBrands);

// 🔁 Bulk Operations
router.post("/bulk-delete", bulkDeleteBrands);
router.post("/bulk-edit", bulkEditBrands);

// 🔧 Basic CRUD
router.post("/", createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;
