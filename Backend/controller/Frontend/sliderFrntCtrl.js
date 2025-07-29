const Slider = require("../../models/sliderModel");
const asyncHandler = require("express-async-handler");

const getSliders = asyncHandler(async (req, res) => {
  try {
    const sliders = await Slider.find({}, "title description link images");
    
    const formattedSliders = sliders.map(slider => ({
      title: slider.title,
      description: slider.description,
      link: slider.link,
      // image: slider.images[0],
      images: slider.images.slice(0, 2),
    }));

    res.status(200).json({ success: true, data: formattedSliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = {
  getSliders,
};
