// test.js
const WebSocket = require('ws');

const uri = "ws://192.168.100.88:8015/ws/v2";

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').split('.')[0];
}

function connectToStockWebSocket() {
    console.log(`Attempting to connect to ${uri}...`);
    
    const ws = new WebSocket(uri);

    ws.on('open', () => {
        console.log("Connection established! Waiting for data...");
    });

    ws.on('message', (data) => {
        try {
            const parsedData = JSON.parse(data);
            const timestamp = getCurrentTimestamp();
            console.log(`\n[${timestamp}] Received data for ${parsedData.length} stocks:`);
            console.log("Data:", parsedData, "\n");
        } catch (err) {
            console.error("Error parsing message:", err.message);
        }
    });

    ws.on('close', () => {
        console.log("Connection closed, attempting to reconnect...");
        setTimeout(connectToStockWebSocket, 3000); // retry after 3 seconds
    });

    ws.on('error', (err) => {
        console.error("Connection error:", err.message);
    });
}

console.log("Stock WebSocket Client");
console.log("Press Ctrl+C to exit");
connectToStockWebSocket();
