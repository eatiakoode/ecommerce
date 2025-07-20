const express = require("express");
const multer = require("multer");
const path = require("path");

const { getCustomer, getAllCustomers, updateCustomer, deleteCustomer, importCustomersFromCSV, exportCustomersToCSV } = require("../controllers/customerCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/export", exportCustomersToCSV); // Temporarily remove auth for testing
router.delete("/deleteCustomer/:id", deleteCustomer); // Temporarily remove auth for testing
router.put("/updateCustomer/:id", updateCustomer); // Temporarily remove auth for testing
router.get("/customers", getAllCustomers); // Temporarily remove auth for testing
router.get("/fetchCustomer/:id", getCustomer); // Temporarily remove auth for testing

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "import_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post("/import", upload.single("file"), importCustomersFromCSV); // Temporarily remove auth for testing

module.exports = router;
