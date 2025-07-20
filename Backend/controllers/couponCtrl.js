const Coupon = require("../model/couponModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const asynHandler = require("express-async-handler");
const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");


const createCoupon = asynHandler(async (req, res) => {
  const { name, code, startDate, expiry, discount } = req.body;

  if (!name || !code || !startDate || !expiry || !discount) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(expiry);

  let status = "inactive";
  if (now >= start && now <= end) {
    status = "active";
  } else if (now > end) {
    status = "expired";
  }

  // Check for duplicate name or code
  const existing = await Coupon.findOne({ $or: [{ name }, { code }] });
  if (existing) {
    return res.status(400).json({ message: "Coupon with this name or code already exists." });
  }

  const newCoupon = await Coupon.create({
    name,
    code,
    startDate,
    expiry,
    discount,
    status,
  });

  res.status(201).json(newCoupon);
});

const getAllCoupons = asynHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});
const updateCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const { startDate, expiry } = req.body;
    const now = new Date();

    if (startDate && expiry) {
      const start = new Date(startDate);
      const end = new Date(expiry);

      if (now < start) {
        req.body.status = "inactive";
      } else if (now >= start && now <= end) {
        req.body.status = "active";
      } else if (now > end) {
        req.body.status = "expired";
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    res.json(deletecoupon);
  } catch (error) {
    throw new Error(error);
  }
});
const getCoupon = asynHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getAcoupon = await Coupon.findById(id);
    res.json(getAcoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const importCouponsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = req.file.path;
    const coupons = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const normalizedRow = {};
        for (const key in row) {
          normalizedRow[key.trim()] = row[key].trim();
        }

        const name = normalizedRow.name;
        const code = normalizedRow.code;
        const startDate = normalizedRow.startDate;
        const expiry = normalizedRow.expiry;
        const discount = normalizedRow.discount;

        if (name && code && startDate && expiry && discount) {
          const now = new Date();
          const start = new Date(startDate);
          const end = new Date(expiry);

          let status = "inactive";
          if (now >= start && now <= end) {
            status = "active";
          } else if (now > end) {
            status = "expired";
          }

          coupons.push({
            name: name.toUpperCase(),
            code: code.toUpperCase(),
            startDate: new Date(startDate),
            expiry: new Date(expiry),
            discount: parseFloat(discount),
            status,
          });
        }
      })
      .on("end", async () => {
        console.log("Coupons to insert:", coupons);

        try {
          const inserted = await Coupon.insertMany(coupons, { ordered: false });
          fs.unlinkSync(filePath); // Clean up uploaded CSV
          res.status(201).json({
            message: "Coupons imported successfully from CSV.",
            count: inserted.length,
            coupons: inserted,
          });
        } catch (err) {
          console.error("Insert error:", err);
          res.status(500).json({
            error: "Failed to insert coupons.",
            details: err.message,
          });
        }
      });
  } catch (error) {
    console.error("CSV import error:", error);
    res.status(500).json({ error: "CSV import failed.", details: error.message });
  }
};



const exportCouponsToCSV = async (req, res) => {
  try {
    const coupons = await Coupon.find().lean();

    if (!coupons || coupons.length === 0) {
      return res.status(404).json({ error: "No coupons found to export." });
    }

    // Define fields you want to export
    const fields = [
      "name",
      "code",
      "startDate",
      "expiry",
      "discount",
      "status",
    ];

    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(coupons);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=coupons.csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Export failed", details: error.message });
  }
};


module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  importCouponsFromCSV,
  exportCouponsToCSV,
};
