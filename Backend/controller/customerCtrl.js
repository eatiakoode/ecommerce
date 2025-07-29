const User = require("../models/userModel"); 
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");
const { Parser } = require("json2csv");
const getCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await User.findById(id).select("-password -refreshToken");

    if (!customer) {
      return res.status(404).json({ status: "fail", message: "Customer not found" });
    }

    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password -refreshToken");

    res.status(200).json({
      status: "success",
      results: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Get All Customers Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedCustomer = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!updatedCustomer) {
      return res.status(404).json({
        status: "fail",
        message: "Customer not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await User.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({
        status: "fail",
        message: "Customer not found",
      });
    }

    console.log("Customer deleted successfully:", deletedCustomer._id);
    res.status(200).json({
      status: "success",
      message: "Customer deleted successfully",
      deletedCustomer,
    });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};

const importCustomersFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Validate file type
    if (!req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({ error: "Only CSV files are allowed." });
    }

    console.log("Processing CSV file:", req.file.originalname);

    const filePath = req.file.path;
    const customers = [];
    const processingPromises = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", (row) => {
      processingPromises.push(
        (async () => {
          // Validate required fields
          if (row.email && row.firstname && row.lastname && row.password) {
            const existing = await User.findOne({ email: row.email });
            if (!existing) {
              const hashedPassword = await bcrypt.hash(row.password, 10);
              customers.push({
                firstname: row.firstname.trim(),
                lastname: row.lastname.trim(),
                email: row.email.trim().toLowerCase(),
                mobile: row.mobile || "",
                password: hashedPassword,
                role: row.role || "user",
                isBlocked: row.isBlocked === "true" || false,
              });
            } else {
              console.log("Skipping duplicate email:", row.email);
            }
          } else {
            console.warn("Skipping row with missing required fields:", row);
          }
        })()
      );
    });

    stream.on("end", async () => {
      try {
        await Promise.all(processingPromises); // Wait for all row processing
        
        if (customers.length === 0) {
          return res.status(400).json({ error: "No valid customers found in CSV." });
        }

        const inserted = await User.insertMany(customers, { ordered: false });

        // Clean up uploaded file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

        console.log("Customers imported successfully:", inserted.length);
        res.status(201).json({
          message: "Customers imported from CSV successfully.",
          count: inserted.length,
          customers: inserted,
        });

      } catch (err) {
        console.error("Insert error:", err);
        res.status(500).json({
          error: "Failed to insert customers.",
          details: err.message,
        });
      }
    });

    stream.on("error", (err) => {
      console.error("CSV stream error:", err);
      res.status(500).json({ error: "Error reading CSV file", details: err.message });
    });
  } catch (error) {
    console.error("CSV import error:", error);
    res.status(500).json({ error: "CSV import failed.", details: error.message });
  }
};

const exportCustomersToCSV = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select(
      "firstname lastname email mobile isBlocked createdAt"
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found to export." });
    }

    const fields = ["firstname", "lastname", "email", "mobile", "isBlocked", "createdAt"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(customers);

    const fileName = `customers_export_${Date.now()}.csv`;
    const filePath = path.join(__dirname, "../exports", fileName);

    // Make sure exports directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, csv);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: "Failed to download file." });
      } else {
        // Optional: Delete file after download
        setTimeout(() => {
          fs.unlink(filePath, () => {});
        }, 10000);
      }
    });
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to export customers.", details: error.message });
  }
};

module.exports = {
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  importCustomersFromCSV,
  exportCustomersToCSV
};

