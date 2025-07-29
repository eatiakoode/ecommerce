const Testimonial = require("../models/testimonialModel");
const asyncHandler = require("express-async-handler");

// Create
// const createTestimonial = asyncHandler(async (req, res) => {
//   const { title, description, image, status } = req.body;

//   if (!title || !description) {
//     res.status(400);
//     throw new Error("Title and description are required");
//   }

//   const testimonial = await Testimonial.create({ title, description, image, status });
//   res.status(201).json(testimonial);
// });

const createTestimonial = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Image is required");
  }

  // const image = `/images/${req.file.filename}`;
  // const image = `/uploads/${req.file.filename}`;
  const image = `/uploads/${req.file.filename}`;

  const testimonial = await Testimonial.create({
    title,
    description,
    image,
    status,
  });

  res.status(201).json(testimonial);
});

// Get All
const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(testimonials);
});

// Get by ID
const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) {
    res.status(400);
    throw new Error("Testimonial not found");
  }
  res.json(testimonial);
});

// Update
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonialId = req.params.id;
 
  if (req.file) {
    req.body.image = req.file.filename;
  }
 
  const updated = await Testimonial.findByIdAndUpdate(testimonialId, req.body, { new: true });
 
  if (!updated) {
    res.status(400);
    throw new Error("Testimonial not found");
  }
 
  res.json(updated);
});

// Delete
const deleteTestimonial = asyncHandler(async (req, res) => {
  const deleted = await Testimonial.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(400);
    throw new Error("Testimonial not found");
  }
  res.json({ message: "Deleted successfully" });
});

// Bulk Edit
const bulkEditTestimonials = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("Invalid or empty data format");
  }

  const results = await Promise.all(
    updates.map(async (item) => {
      if (!item._id) return null;
      return await Testimonial.findByIdAndUpdate(item._id, item, { new: true });
    })
  );

  res.json({
    message: "Bulk update completed",
    updated: results.filter(Boolean),
  });
});

module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  bulkEditTestimonials,
};
