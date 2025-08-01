// const express = require("express");
// const {
//   createEnquiry,
//   updateEnquiry,
//   deleteEnquiry,
//   getEnquiry,
//   getallEnquiry,
// } = require("../controller/enqCtrl");
// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
// const router = express.Router();

// router.post("/", createEnquiry);
// router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
// router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
// router.get("/:id", getEnquiry);
// router.get("/", getallEnquiry);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getAllEnquiries } = require('../controller/enqCtrl');

router.get('/', getAllEnquiries);

module.exports = router;
