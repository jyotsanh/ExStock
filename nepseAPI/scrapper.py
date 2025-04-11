from playwright.async_api import async_playwright
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
from bs4 import BeautifulSoup
import datetime
app = FastAPI()
NEPSE_URL = "https://nepalstock.com/today-price"

async def data_extractor_from_html(content):
    try:
        soup = BeautifulSoup(content, "html.parser")
        table = soup.find("table")
        tbody = table.find("tbody")
        tablerows = tbody.find_all("tr")
        data = []

        for tr in tablerows:
            one = {}
            one['symbol'] = tr.find_all("td")[1].text.strip()
            one['close_price'] = tr.find_all("td")[2].text.strip()
            one['open_price'] = tr.find_all("td")[3].text.strip()
            one['high_price'] = tr.find_all("td")[4].text.strip()
            one['low_price'] = tr.find_all("td")[5].text.strip()
            one['total_traded_quantity'] = tr.find_all("td")[6].text.strip()
            one['total_traded_value'] = tr.find_all("td")[7].text.strip()
            one['total_trades'] = tr.find_all("td")[8].text.strip()
            one['ltp'] = tr.find_all("td")[9].text.strip()
            one['fifty_two_week_high'] = tr.find_all("td")[10].text.strip()
            one['fifty_two_week_low'] = tr.find_all("td")[11].text.strip()
            one['timestamp']= datetime.datetime.now().isoformat()
            data.append(one)
        return data
    except Exception as e:
        print(f"data_extractor_from_html error: {e}")
        return None

async def reload_and_extract(page):
    try:
        await page.reload(wait_until="load", timeout=90000)
        await asyncio.sleep(2)
        content = await page.content()
        data = await data_extractor_from_html(content)
        return data
    except Exception as e:
        print(f"Reload error: {e}")
        return None
    
import time
from starlette.websockets import WebSocketState
@app.get("/")
async def health_check():
    return {
            "status":"healthy"
            }

@app.websocket("/ws/stock")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    browser = None
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--disable-http2"])
            context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
            
            page = await context.new_page()
            await page.goto(NEPSE_URL, wait_until="load", timeout=50000)
            
            while True:
                data = await reload_and_extract(page)
                if data is not None:
                    await websocket.send_json(data)
                await asyncio.sleep(2)  # Wait interval regardless of success/failure
    
    except WebSocketDisconnect:
        print("WebSocket connection closed")
        return
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if browser:
            await browser.close()
        if websocket.application_state != WebSocketState.DISCONNECTED:
            await websocket.close()

@app.websocket("/ws/chart")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    browser = None
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--disable-http2"])
            context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
            
            page = await context.new_page()
            await page.goto(NEPSE_URL, wait_until="load", timeout=50000)
            
            while True:
                data = await reload_and_extract(page)
                if data is not None:
                    await websocket.send_json(data)
                await asyncio.sleep(2)  # Wait interval regardless of success/failure
    
    except WebSocketDisconnect:
        print("WebSocket connection closed")
        return
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if browser:
            await browser.close()
        if websocket.application_state != WebSocketState.DISCONNECTED:
            await websocket.close()
