const express = require("express");
const router = express.Router();

const {
  getCategoriesWithProductCount,
  getFilteredProducts,
  getAllCategories,
  getProductsByCategorySlug
} = require("../../controller/Frontend/categoryCtrl");

router.get("/category-list", getCategoriesWithProductCount);
router.get("/filter", getFilteredProducts);
router.get("/all", getAllCategories);
router.get("/:slug", getProductsByCategorySlug);

module.exports = router;
