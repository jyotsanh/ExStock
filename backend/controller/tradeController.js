const Trade = require("../models/trade");
const User = require("../models/users"); 

const saveTrade = async (req, res) => {
  try {
    const { userId, symbol, action, quantity, price } = req.body;

    if (!userId || !symbol || !action || !quantity || !price) {
      return res.status(400).json({ error: "All fields are required." });
    }

   
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    const total = price * quantity;

    const trade = new Trade({
      user: userId, 
      symbol,
      action,
      quantity,
      price
    });

    await trade.save();

    res.status(201).json({ message: "Trade saved successfully.", trade });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save trade." });
  }
};

module.exports = { saveTrade };
