const Trade = require("../models/trade");

const getPortfolioWithoutLivePrice = async (req, res) => {
  try {
    const { userId } = req.params;

    const trades = await Trade.find({ userId });

    if (trades.length === 0) {
      return res.status(404).json({ message: "No trades found for this user." });
    }

    const holdings = {};

    trades.forEach(trade => {
      const { symbol, quantity, action, price, timestamp } = trade;

      if (!holdings[symbol]) {
        holdings[symbol] = {
          symbol,
          quantity: 0,
          totalCost: 0,
          lastTradeDate: timestamp
        };
      }

      if (action === "buy") {
        holdings[symbol].totalCost += price * quantity;
        holdings[symbol].quantity += quantity;
      } else if (action === "sell") {
        holdings[symbol].totalCost -= price * quantity;
        holdings[symbol].quantity -= quantity;
      }

      holdings[symbol].lastTradeDate = timestamp;
    });

    // Filter out stocks with 0 or negative quantity
    const portfolio = Object.values(holdings).filter(h => h.quantity > 0).map(h => ({
      symbol: h.symbol,
      quantity: h.quantity,
      avgBuyPrice: (h.totalCost / h.quantity).toFixed(2),
      lastTradeDate: h.lastTradeDate,
      totalInvested: h.totalCost.toFixed(2),
    }));

    return res.json({ portfolio });

  } catch (error) {
    console.error("Portfolio error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getPortfolioWithoutLivePrice };
