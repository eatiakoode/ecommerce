const express = require("express");
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  updateStaff,
  updateStaffStatus
} = require("../controller/staffCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/",authMiddleware, isAdmin, createStaff);
router.get("/",authMiddleware, isAdmin, getAllStaff);
router.get("/:id",authMiddleware, isAdmin, getStaffById);
router.put("/:id",authMiddleware, isAdmin, updateStaff);
router.delete("/:id",authMiddleware, isAdmin, deleteStaff);
router.put("/update-status/:id",authMiddleware, isAdmin, updateStaffStatus);

module.exports = router;