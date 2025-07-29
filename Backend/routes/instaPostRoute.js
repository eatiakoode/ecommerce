const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const {
  createInstapost,
  getAllInstaposts,
  updateInstapost,
  deleteInstapost,
  bulkEditInstaposts,
  getInstapostById
} = require('../controller/instaPostCtrl');

// Routes
// router.post('/', createInstapost);
router.post("/create", authMiddleware, isAdmin, upload.single("image"), createInstapost);
router.get('/', authMiddleware, isAdmin, getAllInstaposts);
router.get('/:id', authMiddleware, isAdmin, getInstapostById);
router.put('/:id', authMiddleware, isAdmin,upload.single("imageLink"), updateInstapost);
router.delete('/:id', authMiddleware, isAdmin, deleteInstapost);
router.put('/bulk/edit', authMiddleware, isAdmin, bulkEditInstaposts);

module.exports = router;
