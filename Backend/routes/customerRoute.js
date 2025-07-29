const express = require("express");
const multer = require("multer");
const path = require("path");

const { getCustomer, getAllCustomers, updateCustomer, deleteCustomer, importCustomersFromCSV, exportCustomersToCSV } = require("../controller/customerCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/export",authMiddleware, isAdmin, exportCustomersToCSV); // Temporarily remove auth for testing
router.delete("/deleteCustomer/:id",authMiddleware, isAdmin, deleteCustomer); // Temporarily remove auth for testing
router.put("/updateCustomer/:id",authMiddleware, isAdmin, updateCustomer); // Temporarily remove auth for testing
router.get("/customers",authMiddleware,isAdmin, getAllCustomers); // Temporarily remove auth for testing
router.get("/fetchCustomer/:id",authMiddleware,isAdmin, getCustomer); // Temporarily remove auth for testing

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "import_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post("/import",authMiddleware,isAdmin, upload.single("file"), importCustomersFromCSV); // Temporarily remove auth for testing

module.exports = router;
