const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User', 
    required: true
  },
  symbol: String,
  action: { type: String, enum: ['buy', 'sell'] },
  quantity: Number,
  price: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trade", tradeSchema);
