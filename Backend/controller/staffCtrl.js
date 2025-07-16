const Staff = require("../models/staffModel");
const asyncHandler = require("express-async-handler");

// Create new staff member
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, role, status } = req.body;

  // Validation check
  if (!name || !email || !phone || !role) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const staffExists = await Staff.findOne({ email });
  if (staffExists) {
    res.status(400);
    throw new Error("Staff with this email already exists");
  }

  const staff = await Staff.create({ name, email, phone, role, status: status || "Active" });
  res.status(201).json(staff);
});

// Get all staff
const getAllStaff = asyncHandler(async (req, res) => {
  const staffList = await Staff.find();
  res.json(staffList);
});

// Get staff by ID
const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }
  res.json(staff);
});

// Delete staff
const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }
  res.json({ message: "Staff member deleted successfully" });
});

// Update staff
const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!staff) {
    res.status(404);
    throw new Error("Staff member not found");
  }
  res.json(staff);
});

// ✅ Update Staff Status (Active / Deactive)
const updateStaffStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Active", "Deactive"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const staff = await Staff.findById(id);
  if (!staff) {
    return res.status(404).json({ message: "Staff not found" });
  }

  staff.status = status;
  await staff.save();

  res.status(200).json({
    message: `Staff status updated to ${status}`,
    staff,
  });
});


module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  updateStaff,
  updateStaffStatus
};