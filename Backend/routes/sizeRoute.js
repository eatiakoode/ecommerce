// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// const {
//   getSizeById,
//   createSize,
//   getAllSizes,
//   updateSize,
//   deleteSize,
//   bulkEditSizes,
//   //bulkDeleteSizes,
//   exportSizes,
//   importSizes,
// } = require("../controller/sizeCtrl");
// const { getSizeBySlug } = require("../controller/sizeCtrl");
// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// // CSV upload setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, "sizes-" + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".csv") {
//       return cb(new Error("Only CSV files are allowed"));
//     }
//     cb(null, true);
//   },
// });

// // Routes
// router.get("/:id",authMiddleware,isAdmin, getSizeById)
// router.post("/",authMiddleware,isAdmin, createSize);
// router.get("/",authMiddleware,isAdmin, getAllSizes);
// router.put("/:id",authMiddleware,isAdmin, updateSize);
// router.delete("/:id",authMiddleware,isAdmin, deleteSize);
// router.put("/bulk",authMiddleware,isAdmin, bulkEditSizes);
// //router.delete("/bulk-delete", bulkDeleteSizes);
// router.get("/export",authMiddleware,isAdmin, exportSizes);
// router.post("/import",authMiddleware,isAdmin, upload.single("file"), importSizes); // ✅ CSV import
// router.get("/slug/:slug",authMiddleware,isAdmin, getSizeBySlug);

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getSizeById,
  createSize,
  getAllSizes,
  updateSize,
  deleteSize,
  bulkEditSizes,
  exportSizes,
  importSizes,
  getSizeBySlug,
} = require("../controller/sizeCtrl");
 
// CSV upload setup

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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
 
// ✅ Place specific routes first

router.get("/export", exportSizes);
router.post("/import", upload.single("file"), importSizes);
router.get("/slug/:slug", getSizeBySlug);
 
// ✅ Then general and dynamic routes

router.get("/", getAllSizes);
router.post("/", createSize);
router.put("/bulk", bulkEditSizes);

// router.delete("/bulk-delete", bulkDeleteSizes); // uncomment if needed

router.get("/:id", getSizeById);
router.put("/:id", updateSize);
router.delete("/:id", deleteSize);

module.exports = router;
 