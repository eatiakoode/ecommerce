const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  getSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} = require("../controller/sliderCtrl");

router.get("/", authMiddleware, isAdmin, getSliders);
router.get("/:id", authMiddleware, isAdmin, getSliderById);
router.post("/", authMiddleware, isAdmin, upload.array("images",5), createSlider);
router.put("/:id", authMiddleware, isAdmin, upload.array("images",5), updateSlider);
router.delete("/:id", authMiddleware, isAdmin, deleteSlider);

module.exports = router; 