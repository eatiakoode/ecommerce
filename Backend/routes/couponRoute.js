const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  importCouponsFromCSV,
  exportCouponsToCSV,
} = require("../controllers/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/export", authMiddleware, isAdmin, exportCouponsToCSV);
router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "coupons_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/import", authMiddleware, isAdmin, upload.single("file"),importCouponsFromCSV
);


module.exports = router;
