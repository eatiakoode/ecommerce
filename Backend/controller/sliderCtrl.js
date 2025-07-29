const Slider = require("../models/sliderModel");
const asyncHandler = require("express-async-handler");

// Get all sliders
const getSliders = asyncHandler(async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new slider with image upload
const createSlider = asyncHandler(async (req, res) => {
  const { title, description, link } = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("At least one image file is required");
  }

  // const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);


  const slider = await Slider.create({
    title,
    description,
    images: imagePaths,
    link,
  });

  res.status(201).json({ success: true, data: slider });
});

// Update a slider
const updateSlider = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
 
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.filename);
    }
 
    const slider = await Slider.findByIdAndUpdate(id, req.body, { new: true });
 
    if (!slider) {
      return res.status(404).json({ success: false, message: "Slider not found" });
    }
 
    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a slider
const deleteSlider = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Slider.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Slider deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const getSliderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
 
  const slider = await Slider.findById(id);
  if (!slider) {
    res.status(404);
    throw new Error("Slider not found");
  }
 
  res.status(200).json(slider);
});

module.exports = {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  getSliderById,
}; 