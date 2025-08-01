const express = require("express");
const router = express.Router();
const {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controller/addressCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");



// All routes are protected
router.use(authMiddleware);

// Get all addresses for user
router.get("/", getUserAddresses);

// Create new address
router.post("/", createAddress);

// Set default address (must come before /:id routes)
router.patch("/:id/default", setDefaultAddress);

// Get single address
router.get("/:id", getAddress);

// Update address
router.put("/:id", updateAddress);

// Delete address
router.delete("/:id", deleteAddress);

module.exports = router; 