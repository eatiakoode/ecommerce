// const ContactForm = require("../../models/Frontend/contactFormModel");
// const asyncHandler = require("express-async-handler");

// const submitContactForm = asyncHandler(async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     res.status(400);
//     throw new Error("All fields are required");
//   }

//   const form = await ContactForm.create({ name, email, message });
//   res.status(201).json({ success: true, data: form });
// });

// module.exports = { submitContactForm };


const ContactForm = require('../../models/contactFormModel');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = await ContactForm.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
