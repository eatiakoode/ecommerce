const express = require("express");
const {
  createdeal,
  updatedeal,
  deletedeal,
  getdeal,
  getalldeal,
} = require("../controller/dealCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createdeal);
router.put("/:id", authMiddleware, isAdmin, updatedeal);
router.delete("/:id", authMiddleware, isAdmin, deletedeal);
router.get("/:id", getdeal);
router.get("/", getalldeal);

module.exports = router;
