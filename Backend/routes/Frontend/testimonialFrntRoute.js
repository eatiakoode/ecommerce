const express = require("express");
const router = express.Router();
const { getTestimonialPreviews } = require("../../controller/Frontend/testimonialFrntCtrl");

router.get("/lists", getTestimonialPreviews);

module.exports = router;
