 // backend/controller/teamCtrl.js
const Team = require("../models/teamModel");
const asyncHandler = require("express-async-handler");

// Create
// const createTeam = asyncHandler(async (req, res) => {
//   const newTeam = await Team.create(req.body);
//   res.status(201).json(newTeam);
// });

const createTeam = asyncHandler(async (req, res) => {
  const { title, designation } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Image is required");
  }

  const image = `/uploads/${req.file.filename}`;

  const newTeam = await Team.create({ title, designation, image });

  res.status(201).json(newTeam);
});

// Read all
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

// Read one
const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) throw new Error("Team member not found");
  res.json(team);
});

// Update
// const updateTeam = asyncHandler(async (req, res) => {
//   const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   if (!team) throw new Error("Team member not found");
//   res.json(team);
// });

const updateTeam = asyncHandler(async (req, res) => {
  const teamId = req.params.id;

  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  const team = await Team.findByIdAndUpdate(teamId, req.body, {
    new: true,
  });

  if (!team) {
    res.status(404);
    throw new Error("Team member not found");
  }

  res.json(team);
});

// Delete
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) throw new Error("Team member not found");
  res.json({ message: "Deleted successfully" });
});

module.exports = {
  createTeam,
  getAllTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};
