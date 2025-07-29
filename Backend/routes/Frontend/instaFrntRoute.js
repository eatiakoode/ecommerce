const express = require("express");
const router = express.Router();

const { getInstagramProducts } = require("../../controller/Frontend/instaFrntCtrl");

router.get("/lists", getInstagramProducts);

module.exports = router; 