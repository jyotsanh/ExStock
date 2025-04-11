const express = require("express");
const { trade } = require("../controller/tradeController");
const router = express.Router();

router.post("/", trade);

module.exports = router;
