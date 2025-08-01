const express = require("express");
const router = express.Router();
const { getAllBrands, getAllTeams } = require("../../controller/Frontend/aboutusFrntCtrl");

router.get("/logos", getAllBrands);
router.get("/teams", getAllTeams);

module.exports = router;
