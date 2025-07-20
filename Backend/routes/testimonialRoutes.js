const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  bulkEditTestimonials,
} = require("../controllers/testimonialCtrl");

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);
router.put("/bulk/edit", bulkEditTestimonials);

module.exports = router;
