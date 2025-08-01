const Brand = require("../../models/brandModel");
const Team = require("../../models/teamModel");
const asyncHandler = require("express-async-handler");

// const getAllBrands = asyncHandler(async (req, res) => {
//   try {
//     const brands = await Brand.find({ status: "active" }).sort({ createdAt: -1 });
//     res.json(brands);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find({ status: "active" }).select("image");
    console.log("Returned brands: ", brands);
    res.json(brands);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await Team.find().select("title image designation");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch teams");
  }
});

module.exports = { getAllBrands, getAllTeams };
