const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    bulkEditTestimonials,
} = require("../controller/testimonialCtrl");

// router.post("/", createTestimonial);
router.post("/create", authMiddleware, isAdmin, upload.single("image"), createTestimonial);
router.get("/", authMiddleware, isAdmin, getAllTestimonials);
router.get("/:id", authMiddleware, isAdmin, getTestimonialById);
router.put("/:id", authMiddleware, isAdmin,upload.single("image"), updateTestimonial);
router.delete("/:id", authMiddleware, isAdmin, deleteTestimonial);
router.put("/bulk/edit", authMiddleware, isAdmin, bulkEditTestimonials);

module.exports = router;
