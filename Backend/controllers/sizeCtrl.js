const Size = require("../model/sizeModel");
const asyncHandler = require("express-async-handler");
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");

// ➤ Create Size
const createSize = asyncHandler(async (req, res) => {
  const { name, value, type, isActive } = req.body;

  if (!name || !value || !type) {
    return res.status(400).json({
      message: "Name, value, and type are required",
    });
  }

  const existing = await Size.findOne({ name });
  if (existing) {
    return res.status(400).json({ message: "Size already exists" });
  }

  const size = await Size.create({ name, value, type, isActive });
  res.status(201).json(size);
});

// ➤ Get All Sizes
const getAllSizes = asyncHandler(async (req, res) => {
  const sizes = await Size.find().sort("-createdAt");
  res.json(sizes);
});

// ➤ Update Size
const updateSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Size.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});

// ➤ Delete Size
const deleteSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Size.findByIdAndDelete(id);
  res.json({ message: "Size deleted" });
});

// ➤ Bulk Edit Sizes
const bulkEditSizes = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: "Expected array of updates" });
  }

  const bulkOps = updates.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: item },
    },
  }));

  await Size.bulkWrite(bulkOps);
  res.json({ message: "Bulk update successful" });
});

// ➤ Export Sizes to CSV
const exportSizes = asyncHandler(async (req, res) => {
  const sizes = await Size.find();

  const filePath = path.join(__dirname, "../exports/sizes.csv");
  const ws = fs.createWriteStream(filePath);
  const csvStream = csv.format({ headers: true });

  csvStream.pipe(ws);
  sizes.forEach((size) => {
    csvStream.write({
      Name: size.name,
      Value: size.value,
      Type: size.type,
      IsActive: size.isActive,
    });
  });
  csvStream.end();

  ws.on("finish", () => {
    res.download(filePath, "sizes.csv");
  });
});

// ➤ Import Sizes from CSV
const importSizes = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV file required" });

  const sizes = [];

  fs.createReadStream(req.file.path)
    .pipe(csv.parse({ headers: true }))
    .on("data", (row) => {
      sizes.push({
        name: row.Name,
        value: row.Value,
        type: row.Type,
        isActive: row.IsActive?.toLowerCase() === "true",
      });
    })
    .on("end", async () => {
      try {
        await Size.insertMany(sizes, { ordered: false });
        // fs.unlinkSync(req.file.path);
        res.json({ message: "Import successful" });
      } catch (err) {
        res.status(500).json({ message: "Import failed", error: err.message });
      }
    });
});

module.exports = {
  createSize,
  getAllSizes,
  updateSize,
  deleteSize,
  bulkEditSizes,
  exportSizes,
  importSizes,
};
