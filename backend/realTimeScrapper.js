const WebSocket = require("ws");

let livePrices = {}; // { symbol: { price, volume, lastUpdated } }

// Connect to NEPSE WebSocket
const socket = new WebSocket("ws://192.168.100.88:8015/ws/stock");

// Handle connection open
socket.on("open", () => {
  console.log("Connected to NEPSE WebSocket server.");
});

// Handle incoming messages
socket.on("message", (data) => {
  try {
    const parsed = JSON.parse(data); // assuming the incoming message is JSON

    // Example structure you may need to adapt:
    // { symbol: 'NABIL', close: 970.5, volume: 5000 }

    const symbol = parsed.symbol;
    if (!symbol) return;

    livePrices[symbol] = {
      price: parsed.close,
      volume: parsed.volume,
      lastUpdated: new Date(),
    };

    // Optional: Log once for demo
    console.log(`${symbol} updated -> Rs. ${parsed.close}`);
  } catch (err) {
    console.error("Error parsing WebSocket message:", err.message);
  }
});

// Handle connection errors
socket.on("error", (err) => {
  console.error("WebSocket error:", err.message);
});

// Handle disconnects and auto-reconnect
socket.on("close", () => {
  console.log("WebSocket connection closed. Attempting to reconnect in 5 seconds...");
  setTimeout(() => {
    require("child_process").fork(__filename); // crude restart (optional: switch to reconnect logic)
    process.exit();
  }, 5000);
});

module.exports = {
  getLivePrice: (symbol) => livePrices[symbol],
  getAllPrices: () => livePrices,
};
