const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
 
// ✅ Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
 
// ✅ CSV file filter
const fileFilter = (req, file, cb) => {
  const fileTypes = /csv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb(new Error("Only CSV files are allowed"));
};
 
const upload = multer({ storage: storage, fileFilter });
 
// ✅ Import controller functions — double check all these exist
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
} = require("../controller/brandCtrl");
 
// 📦 CSV Import/Export Routes
router.get("/export", exportBrands);
 
// ⚠️ Ensure Postman/file field name is "file"
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