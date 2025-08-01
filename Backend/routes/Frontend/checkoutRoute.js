const express = require("express");
const { checkoutCOD } = require("../../controller/Frontend/checkoutCtrl");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, checkoutCOD);

module.exports = router;