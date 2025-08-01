// backend/routes/teamRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("../controller/teamCtrl");
const upload = require("../middlewares/upload");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Routes
router.post("/", authMiddleware, isAdmin, upload.single("image"), createTeam);
router.get("/", authMiddleware, isAdmin, getAllTeams);
router.get("/:id", authMiddleware, isAdmin, getTeam);
router.put("/:id", authMiddleware, isAdmin,upload.single("image"), updateTeam);
router.delete("/:id", authMiddleware, isAdmin, deleteTeam);

module.exports = router;
