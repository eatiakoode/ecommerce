const express = require("express");
const router = express.Router();

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
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.get("/export", authMiddleware,isAdmin, exportCategories);
router.post("/import",  authMiddleware,isAdmin, upload.single("file"), importCategories);
router.post("/bulk-delete", authMiddleware,isAdmin, bulkDeleteCategories);
router.put("/bulk-edit", authMiddleware,isAdmin, bulkEditCategories);
router.get("/paginated", authMiddleware,isAdmin, getPaginatedCategories);
router.get("/", authMiddleware,isAdmin, getAllCategories);
router.get("/:id", authMiddleware,isAdmin, getCategory);
router.put("/:id", authMiddleware,isAdmin, upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware,isAdmin, deleteCategory);
router.post(
  "/", authMiddleware,isAdmin,
  upload.single("image"),
  createCategory
);

module.exports = router;
