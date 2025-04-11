const Portfolio = require("../models/portfolio");
const { getLivePrice } = require("../realTimeScrapper");

const trade = async (req, res) => {
  const { userId, symbol, action, quantity } = req.body;
  const live = getLivePrice(symbol);

  if (!live) return res.status(404).json({ error: "Stock not available right now." });

  const price = live.price;
  const total = price * quantity;

  const portfolio = await Portfolio.findOne({ userId });
  if (!portfolio) return res.status(404).json({ error: "Portfolio not found." });

  if (action === "buy") {
    if (portfolio.cash < total) return res.status(400).json({ error: "Not enough balance." });

    const existing = portfolio.holdings.find(h => h.symbol === symbol);
    if (existing) {
      const prevQty = existing.quantity;
      existing.avgPrice = (existing.avgPrice * prevQty + total) / (prevQty + quantity);
      existing.quantity = prevQty + quantity;
    } else {
      portfolio.holdings.push({ symbol, quantity, avgPrice: price });
    }

    portfolio.cash -= total;

  } else if (action === "sell") {
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ error: "Not enough shares." });
    }

    holding.quantity -= quantity;
    portfolio.cash += total;

    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
    }
  }

  await portfolio.save();
  return res.json({ message: "Trade executed.", portfolio });
};

module.exports = { trade };
