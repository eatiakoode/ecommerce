const FAQ = require("../models/faqModel");
const { FAQ_TYPES } = require("../models/faqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// CREATE
// exports.createFAQ = asyncHandler(async (req, res) => {
//   const { title, description, type } = req.body;

//   if (!title || !description || !type) {
//     return res.status(400).json({ message: "title, description & type are required" });
//   }

//   const faq = await FAQ.create({ title, description, type });
//   res.status(201).json(faq);
// });

// const { FAQ_TYPES } = require("../models/faqModel");

// const SLUGS_MAP = {
//   "how to buy": "how-to-buy",
//   "exchange and return": "exchange-and-return",
//   "refund question": "refund-question",
// };

// exports.createFAQ = asyncHandler(async (req, res) => {
//   const { title, description, type } = req.body;

//   if (!title || !description || !type) {
//     return res.status(400).json({ message: "title, description & type are required" });
//   }

//   if (!FAQ_TYPES.includes(type)) {
//     return res.status(400).json({ message: `Invalid type. Must be one of: ${FAQ_TYPES.join(", ")}` });
//   }

//   const slug = SLUGS_MAP[type];

//   const faq = await FAQ.create({ title, description, type, slug });
//   res.status(201).json(faq);
// });

const SLUGS_MAP = {
  "how to buy": "how-to-buy",
  "exchange and return": "exchange-and-return",
  "refund question": "refund-question",
};

exports.createFAQ = asyncHandler(async (req, res) => {
  const { title, description, type } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({ message: "title, description & type are required" });
  }

  if (!FAQ_TYPES.includes(type)) {
    return res.status(400).json({ message: `Invalid type. Must be one of: ${FAQ_TYPES.join(", ")}` });
  }

  const slug = SLUGS_MAP[type];

  const faq = await FAQ.create({ title, description, type, slug });
  res.status(201).json(faq);
});

exports.getAllFAQs = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.type = type;

  const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
  res.status(200).json(faqs);
});

// READ ONE
exports.getFAQById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const faq = await FAQ.findById(id);
  if (!faq) return res.status(404).json({ message: "FAQ not found" });

  res.status(200).json(faq);
});

// UPDATE
// exports.updateFAQ = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);

//   const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
//   if (!updated) return res.status(404).json({ message: "FAQ not found" });

//   res.status(200).json(updated);
// });

exports.updateFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const { type } = req.body;

  if (type) {
    if (!FAQ_TYPES.includes(type)) {
      return res.status(400).json({ message: `Invalid type. Must be one of: ${FAQ_TYPES.join(", ")}` });
    }
    req.body.slug = SLUGS_MAP[type];
  }

  const updated = await FAQ.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "FAQ not found" });

  res.status(200).json(updated);
});

// DELETE
exports.deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const deleted = await FAQ.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "FAQ not found" });

  res.status(200).json({ message: "FAQ deleted successfully" });
});
