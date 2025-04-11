const express = require("express");
const router = express.Router();
const { saveTrade } = require("../controller/tradeController");

router.post("/save", saveTrade);

module.exports = router;
