const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
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
} = require("../controller/categoryCtrl");

router.post("/", createCategory);
router.get("/export", exportCategories);
router.post("/import", upload.single("file"), importCategories);
router.post("/bulk-delete", bulkDeleteCategories);
router.put("/bulk-edit", bulkEditCategories);
router.get("/paginated", getPaginatedCategories);
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
