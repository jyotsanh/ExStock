const Trade = require("../models/trade");
const User = require("../models/users"); 

const saveTrade = async (req, res) => {
  try {
    const { userId, symbol, quantity, price, action } = req.body;

    if (!userId || !symbol || !action || !quantity || !price) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found." });

    const tradeCost = price * quantity;

    if (action === "buy") {
      if (user.virtualCoins < tradeCost) {
        return res.status(400).json({ error: "Insufficient virtual coin balance." });
      }
      user.virtualCoins -= tradeCost;
    } else if (action === "sell") {
      user.virtualCoins += tradeCost;
    } else {
      return res.status(400).json({ error: "Invalid trade action. Use 'buy' or 'sell'." });
    }

    await user.save();

    const trade = new Trade({
      user: userId,
      symbol,
      quantity,
      price,
      action,
      timestamp: new Date(),
    });

    await trade.save();

    res.status(201).json({ message: "Trade saved successfully.", trade, virtualCoins: user.virtualCoins });

  } catch (err) {
    console.error("Trade error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { saveTrade };
