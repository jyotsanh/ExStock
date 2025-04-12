const Trade = require("../models/trade");

const saveTrade = async (req, res) => {
  try {
    const { userId, symbol, action, quantity, price } = req.body;

    if (!userId || !symbol || !action || !quantity || !price) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const total = price * quantity;

    const trade = new Trade({ userId, symbol, action, quantity, price, total });
    await trade.save();

    res.status(201).json({ message: "Trade saved successfully.", trade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save trade." });
  }
};

module.exports = { saveTrade };
