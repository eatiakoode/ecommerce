const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/userAuthCtrl");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
