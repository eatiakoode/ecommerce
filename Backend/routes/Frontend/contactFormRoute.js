//  const express = require("express");
// const router = express.Router();
// const { submitContactForm } = require("../../controller/Frontend/contactFormCtrl");

// // ✅ POST /api/frontend/contact-form
// router.post("/", submitContactForm);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../../controller/Frontend/contactFormCtrl');

router.post('/', submitContactForm);

module.exports = router;