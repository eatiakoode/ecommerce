const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const validateMongoDbId = require("../utils/validateMongoDbId");

// Get all addresses for a user
const getUserAddresses = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const addresses = await Address.find({ user: _id, isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get single address
const getAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Create new address
const createAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const newAddress = await Address.create({
      ...req.body,
      user: _id,
    });
    res.json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update address
const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  validateMongoDbId(id);
  try {
    const address = await Address.findOneAndUpdate(
      { _id: id, user: _id },
      req.body,
      { new: true }
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete address
const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  validateMongoDbId(id);
  try {
    const address = await Address.findOneAndUpdate(
      { _id: id, user: _id },
      { isActive: false },
      { new: true }
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Set default address
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  validateMongoDbId(id);
  try {
    // First, remove default from all addresses
    await Address.updateMany(
      { user: _id },
      { isDefault: false }
    );
    
    // Then set the selected address as default
    const address = await Address.findOneAndUpdate(
      { _id: id, user: _id },
      { isDefault: true },
      { new: true }
    );
    
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getUserAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
}; 