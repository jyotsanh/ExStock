const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  avgPrice: Number,
});

const portfolioSchema = new mongoose.Schema({
  userId: String,
  cash: { type: Number, default: 100000 },
  holdings: [holdingSchema],
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
