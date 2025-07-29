const asyncHandler = require("express-async-handler");
const Testimonial = require("../../models/testimonialModel");

const getTestimonialPreviews = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}, "image title description").sort({ createdAt: -1 });
  res.status(200).json(testimonials);
});

module.exports = {
  getTestimonialPreviews,
};
