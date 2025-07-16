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

router.post("/", createStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);
router.put("/update-status/:id", updateStaffStatus);

module.exports = router;