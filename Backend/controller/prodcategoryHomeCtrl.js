const Category = require("../models/prodcategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const getCategoryHome = asyncHandler(async (req, res) => {
  try {
    const getCategoryHome = await Category.find({ status: true });
    res.json(getCategoryHome);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getCategoryHome
};