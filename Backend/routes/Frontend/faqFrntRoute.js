const express = require("express");
const router = express.Router();
const { getAllFAQsGrouped } = require("../../controller/Frontend/faqFrntCtrl");

router.get("/", getAllFAQsGrouped);

module.exports = router;
