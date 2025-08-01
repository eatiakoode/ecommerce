const asyncHandler = require("express-async-handler");
const FAQ = require("../../models/faqModel");

// exports.getAllFAQsGrouped = asyncHandler(async (req, res) => {
//   const faqs = await FAQ.find().sort({ createdAt: -1 });

//   const groupedFAQs = faqs.reduce((acc, faq) => {
//     if (!acc[faq.type]) acc[faq.type] = [];
//     acc[faq.type].push({ 
//       _id: faq._id,
//       title: faq.title,
//       description: faq.description,
//     });
//     return acc;
//   }, {});

//   res.status(200).json(groupedFAQs);
// });

exports.getAllFAQsGrouped = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find().sort({ createdAt: -1 });

  const groupedFAQs = faqs.reduce((acc, faq) => {
    const key = faq.slug; 
    if (!acc[key]) {
      acc[key] = {
        type: faq.type,
        faqs: []
      };
    }

    acc[key].faqs.push({
      _id: faq._id,
      title: faq.title,
      description: faq.description,
    });

    return acc;
  }, {});

  res.status(200).json(groupedFAQs);
});

