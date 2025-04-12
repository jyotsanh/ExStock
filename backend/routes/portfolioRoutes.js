const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/portfolioController");

router.get("/:userId", portfolioController.getPortfolioWithoutLivePrice);

module.exports = router;
