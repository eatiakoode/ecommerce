const express = require("express");
const {
  // createCategory,
  // updateCategory,
  // deleteCategory,
  // getCategory,
  // getallCategory,
  getCategoryHome
} = require("../controller/prodcategoryHomeCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/", authMiddleware, isAdmin, createCategory);
// router.put("/:id", authMiddleware, isAdmin, updateCategory);
// router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
// router.get("/:id", getCategory);
// router.get("/", getallCategory);
router.get("/home", getCategoryHome);

module.exports = router;
