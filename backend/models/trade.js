const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  symbol: String,
  action: { type: String, enum: ['buy', 'sell'] },
  quantity: Number,
  price: Number,
  total: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trade", tradeSchema);
