const express = require("express");
const router = express.Router();

const { getSliders } = require("../../controller/Frontend/sliderFrntCtrl");

router.get("/", getSliders);

module.exports = router;
