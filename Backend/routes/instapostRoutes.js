const express = require('express');
const router = express.Router();
const {
  createInstapost,
  getAllInstaposts,
  updateInstapost,
  deleteInstapost,
  bulkEditInstaposts
} = require('../controllers/instapostCtrl');

// Routes
router.post('/', createInstapost);
router.get('/', getAllInstaposts);
router.put('/:id', updateInstapost);
router.delete('/:id', deleteInstapost);
router.put('/bulk/edit', bulkEditInstaposts);

module.exports = router;
