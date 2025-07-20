const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createSize,
  getAllSizes,
  updateSize,
  deleteSize,
  bulkEditSizes,
  //bulkDeleteSizes,
  exportSizes,
  importSizes,
} = require("../controllers/sizeCtrl");

// CSV upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, "sizes-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

// Routes
router.post("/", createSize);
router.get("/", getAllSizes);
router.put("/:id", updateSize);
router.delete("/:id", deleteSize);
router.put("/bulk", bulkEditSizes);
//router.delete("/bulk-delete", bulkDeleteSizes);
router.get("/export", exportSizes);
router.post("/import", upload.single("file"), importSizes); // ✅ CSV import

module.exports = router;
