const Category = require("../model/prodcategoryModel.js");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");

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