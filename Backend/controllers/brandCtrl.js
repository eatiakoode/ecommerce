const Brand = require("../model/brandModel");
const asyncHandler = require("express-async-handler");
const validateBrandId = require("../utils/validateBrandId");
const csv = require("csvtojson");
const { Parser } = require("json2csv");

// CREATE
exports.createBrand = asyncHandler(async (req, res) => {
  const newBrand = await Brand.create(req.body);
  res.status(201).json(newBrand);
});

// GET ALL
exports.getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

// GET SINGLE
exports.getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateBrandId(id);
  const brand = await Brand.findById(id);
  if (!brand) throw new Error("Brand not found");
  res.json(brand);
});

// UPDATE
exports.updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateBrandId(id);
  const updated = await Brand.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) throw new Error("Brand not found for update");
  res.json(updated);
});

// DELETE
exports.deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateBrandId(id);
  const deleted = await Brand.findByIdAndDelete(id);
  if (!deleted) throw new Error("Brand not found for deletion");
  res.json({ message: "Brand deleted successfully" });
});

// BULK DELETE
exports.bulkDeleteBrands = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid ID list");
  }
  await Brand.deleteMany({ _id: { $in: ids } });
  res.json({ message: "Brands deleted successfully" });
});

// BULK EDIT
exports.bulkEditBrands = asyncHandler(async (req, res) => {
  const updates = req.body;
  const results = await Promise.all(
    updates.map(async (item) => {
      if (!item._id) return null;
      validateBrandId(item._id);
      return await Brand.findByIdAndUpdate(item._id, item, { new: true });
    })
  );
  res.json({ message: "Bulk update completed", results });
});

// EXPORT
exports.exportBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  const jsonBrands = brands.map(({ _id, name, description, isActive }) => ({
    _id,
    name,
    description,
    isActive,
  }));

  const parser = new Parser();
  const csvData = parser.parse(jsonBrands);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=brands.csv");
  res.status(200).end(csvData);
});

// IMPORT
exports.importBrands = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("CSV file required");

  const brands = await csv().fromFile(req.file.path);

  // Optionally validate CSV structure
  const formattedBrands = brands.map((b) => ({
    name: b.name,
    description: b.description,
    isActive: b.isActive === "true",
  }));

  const inserted = await Brand.insertMany(formattedBrands);
  res.json({ message: "Import successful", count: inserted.length });
});
