const express = require("express");
const router = express.Router();
const { getAllBlogs, getSingleBlogBySlug, getRelatedBlogs } = require("../../controller/Frontend/blogFrntCtrl");

router.get("/list", getAllBlogs);
router.get("/:slug", getSingleBlogBySlug);
router.get("/related/:slug", getRelatedBlogs);

module.exports = router;
