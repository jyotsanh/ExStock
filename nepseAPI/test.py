import asyncio
import websockets
import json
import datetime

async def connect_to_stock_websocket():
    uri = "ws://localhost:8015/ws/v2"
    print(f"Attempting to connect to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connection established! Waiting for data...")
            
            while True:
                try:
                    # Wait for messages from the server
                    response = await websocket.recv()
                    
                    # Parse the JSON data
                    data = json.loads(response)
                    
                    # Print timestamp and data count
                    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    print(f"\n[{current_time}] Received data for {len(data)} stocks:")
                    
                        
                except websockets.exceptions.ConnectionClosed:
                    print("Connection closed, attempting to reconnect...")
                    break
                except Exception as e:
                    print(f"Error: {e}")
                    break
    
    except Exception as e:
        print(f"Failed to connect: {e}")

# Run the async function
if __name__ == "__main__":
    print("Stock WebSocket Client")
    print("Press Ctrl+C to exit")
    try:
        asyncio.run(connect_to_stock_websocket())
    except KeyboardInterrupt:
        print("\nClient stopped by user")
    except Exception as e:
        print(f"Unexpected error: {e}")