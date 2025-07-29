const Brand = require("../models/brandModel");
const csv = require("csv2json");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
 
// ✅ Create a single brand
// const createBrand = async (req, res) => {
//   try {
//     const { title, description, isActive } = req.body;
 
//     const brand = await Brand.create({
//       title,
//       description,
//       isActive,
//     });
 
//     res.status(201).json({ success: true, data: brand });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
 
const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});

// ✅ Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Get single brand by ID
const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Update brand
const updateBrand = async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) return res.status(404).json({ success: false, message: "Brand not found" });
    res.status(200).json({ success: true, data: updatedBrand });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 
// ✅ Delete brand
const deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Brand not found" });
    res.status(200).json({ success: true, message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Bulk delete brands by IDs
const bulkDeleteBrands = async (req, res) => {
  try {
    const { ids } = req.body;
    await Brand.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Selected brands deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Bulk edit brands
const bulkEditBrands = async (req, res) => {
  try {
    const { updates } = req.body;
 
    const updatePromises = updates.map((brand) =>
      Brand.findByIdAndUpdate(brand._id, brand, { new: true })
    );
 
    const results = await Promise.all(updatePromises);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
 
// ✅ Import brands from CSV
const importBrands = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
 
    const filePath = path.join(__dirname, "..", req.file.path);
    const jsonArray = await csv().fromFile(filePath);
 
    const inserted = await Brand.insertMany(jsonArray);
    fs.unlinkSync(filePath); // delete file after import
 
    res.status(200).json({ success: true, message: "Brands imported", data: inserted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// ✅ Export brands to CSV
const exportBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
 
    const csvData = brands.map((brand) => ({
      title: brand.title,
      description: brand.description,
      isActive: brand.isActive,
    }));
 
    const header = "title,description,isActive\n";
    const rows = csvData
      .map((row) => `${row.title},${row.description},${row.isActive}`)
      .join("\n");
 
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=brands.csv");
    res.status(200).end(header + rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 
module.exports = {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  bulkDeleteBrands,
  bulkEditBrands,
  importBrands,
  exportBrands,
};