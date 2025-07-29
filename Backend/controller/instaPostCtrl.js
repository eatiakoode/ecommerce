const Instapost = require("../models/instaPostModel");
const asyncHandler = require("express-async-handler");

// Create
// exports.createInstapost = asyncHandler(async (req, res) => {
//   const { title, imageLink, instaLink, SKU, status } = req.body;
//   const instapost = await Instapost.create({ title, imageLink, instaLink, SKU, status });
//   res.status(201).json(instapost);
// });

exports.createInstapost = asyncHandler(async (req, res) => {
  const { title, instaLink, SKU, status } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  // const imageLink = /images/${req.file.filename};
  const imageLink = `/uploads/${req.file.filename}`;

  const instapost = await Instapost.create({
    title,
    imageLink,
    instaLink,
    // SKU,
    status,
  });

  res.status(201).json(instapost);
});

// Get All
exports.getAllInstaposts = asyncHandler(async (req, res) => {
  const posts = await Instapost.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// Get Single
exports.getInstapostById = asyncHandler(async (req, res) => {
  const post = await Instapost.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Instapost not found");
  }
  res.status(200).json(post);
});

// Update
exports.updateInstapost = asyncHandler(async (req, res) => {
  const { id } = req.params;
 
  if (req.file) {
    req.body.imageLink = req.file.filename;
  }
 
  const post = await Instapost.findByIdAndUpdate(id, req.body, { new: true });
 
  if (!post) {
    res.status(404);
    throw new Error("Instapost not found");
  }
 
  res.status(200).json(post);
});

// Delete
exports.deleteInstapost = asyncHandler(async (req, res) => {
  const post = await Instapost.findByIdAndDelete(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Instapost not found");
  }
  res.status(200).json({ message: "Instapost deleted successfully" });
});

// Bulk Edit
exports.bulkEditInstaposts = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "Request body must be a non-empty array." });
  }

  const bulkOps = updates.map(post => {
    if (!post._id) return null;
    return {
      updateOne: {
        filter: { _id: post._id },
        update: { $set: post },
      },
    };
  }).filter(Boolean);

  await Instapost.bulkWrite(bulkOps);
  res.status(200).json({ message: "Instaposts updated successfully" });
});