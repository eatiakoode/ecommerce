const deal = require("../models/dealModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createdeal = asyncHandler(async (req, res) => {
  try {
    const newdeal = await deal.create(req.body);
    res.json(newdeal);
  } catch (error) {
    throw new Error(error);
  }
});
const updatedeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateddeal = await deal.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateddeal);
  } catch (error) {
    throw new Error(error);
  }
});
const deletedeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteddeal = await deal.findByIdAndDelete(id);
    res.json(deleteddeal);
  } catch (error) {
    throw new Error(error);
  }
});
const getdeal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getadeal = await deal.findById(id);
    res.json(getadeal);
  } catch (error) {
    throw new Error(error);
  }
});
const getalldeal = asyncHandler(async (req, res) => {
  try {
    const getalldeal = await deal.find();
    res.json(getalldeal);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createdeal,
  updatedeal,
  deletedeal,
  getdeal,
  getalldeal,
};
