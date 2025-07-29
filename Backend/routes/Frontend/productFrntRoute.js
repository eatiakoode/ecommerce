const express = require("express");
const router = express.Router();

const { getProducts,getProductBySlug, getRelatedProducts,getFilteredProducts,getCompareProducts } = require("../../controller/Frontend/productFrntCtrl");

router.get("/lists", getProducts);
router.get("/filter", getFilteredProducts);
router.get("/compare", getCompareProducts);
router.get("/:slug", getProductBySlug);
router.get("/related/:slug", getRelatedProducts);



module.exports = router; 