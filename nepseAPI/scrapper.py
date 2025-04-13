from playwright.async_api import async_playwright
import asyncio
from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
from bs4 import BeautifulSoup
import requests
import datetime
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

NEPSE_URL = "https://nepalstock.com/today-price"
MEROLagani = "https://merolagani.com/latestmarket.aspx"
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


def fetch_stock_data(symbol_number):
    "Fetch  specific details of a stock from merolagani"
    try:
        url = f"https://merolagani.com/CompanyDetail.aspx?symbol={symbol_number}"
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        table = soup.find_all("table")
        tbody = table[0].find_all("tbody")
        tbody[0].find("td").text.strip() # -> sector
        tbody[1].find("td").text.strip() # -> Shares Outstanding
        tbody[2].find("td").text.strip() # -> Market Price
        tbody[3].find("td").text.strip() # -> % Change
        tbody[4].find("td").text.strip() # -> Last Traded On
        tbody[5].find("td").text.strip() # -> 52 weeks high-low
        tbody[6].find("td").text.strip() # -> 180 Day Average -> not shown in website
        tbody[7].find("td").text.strip() # -> 120 Day Average
        tbody[8].find("td").text.strip() # -> 1 Year Yield
        tbody[9].find("td").text.strip() # -> EPS
        tbody[10].find("td").text.strip() # -> P/E Ratio
        tbody[11].find("td").text.strip() # -> Book Value
        tbody[12].find("td").text.strip() # -> PBV
        tbody[-2].find("tr").find("td").text.strip() # -> 30-Day Avg Volume
        tbody[-1].find("tr").find("td").text.strip() # -> Market Capitalization


        table[4].find_all("td")[0].text.strip() # -> symbol
        table[4].find_all("td")[1].text.strip() # -> Company Name
        table[4].find_all("td")[2].text.strip() # -> Paidup Value
        table[4].find_all("td")[3].text.strip() # -> Total Paidup Value

        data = {
                "sector": tbody[0].find("td").text.strip(),
                "shares_outstanding": tbody[1].find("td").text.strip(),
                "market_price": tbody[2].find("td").text.strip(),
                "percent_change": tbody[3].find("td").text.strip(),
                "last_traded_on": tbody[4].find("td").text.strip(),
                "52_weeks_high_low": tbody[5].find("td").text.strip(),
                "180_day_average": tbody[6].find("td").text.strip(),
                "120_day_average": tbody[7].find("td").text.strip(),
                "1_year_yield": tbody[8].find("td").text.strip(),
                "eps": " ".join(tbody[9].find("td").stripped_strings),
                "p_e_ratio": tbody[10].find("td").text.strip(),
                "book_value": tbody[11].find("td").text.strip(),
                "pbv": tbody[12].find("td").text.strip(),
                "30_day_avg_volume": tbody[-2].find("tr").find("td").text.strip(),
                "market_capitalization": tbody[-1].find("tr").find("td").text.strip(),

                "symbol": table[4].find_all("td")[0].text.strip(),
                "company_name": table[4].find_all("td")[1].text.strip(),
                "paidup_value": table[4].find_all("td")[2].text.strip(),
                "total_paidup_value": table[4].find_all("td")[3].text.strip()

            }
        return data
    except Exception as e:
        print(f"fetch_stock_data error: {e}")
        return {
                "Error":"heheh"
            }

@app.get("/{SymbolNumber}")
def get_data(SymbolNumber: str):
    data = fetch_stock_data(SymbolNumber)
    if data!=None:
        return data
    return None



async def new_data_extractor_from_html(content):
    try:
        soup = BeautifulSoup(content, "html.parser")
        table = soup.find("table")
        tr = table.find_all("tr")
        all_data = []
        
        tr = tr[1:]
        for data in tr:
            total_data = {}
            print(data.text)
            total_data['symbol'] = data.find_all("td")[0].text.strip()
            total_data['ltp'] = data.find_all("td")[1].text.strip()
            total_data['percent_change'] = data.find_all("td")[2].text.strip()
            total_data['open'] = data.find_all("td")[3].text.strip()
            total_data['high'] = data.find_all("td")[4].text.strip()
            total_data['low'] = data.find_all("td")[5].text.strip()
            total_data['qty'] = data.find_all("td")[6].text.strip()
            total_data['pclose'] = data.find_all("td")[7].text.strip()
            total_data['diff'] = data.find_all("td")[8].text.strip()
            all_data.append(total_data)

        return all_data
    except Exception as e:
        # with open("error_log.html", "a") as f:
        #     f.write(content)
        
        print(f"data_extractor_from_html error: {e}")
        return None

async def new_reload_and_extract(page):
    try:
        await page.reload(wait_until="load", timeout=90000)
        await asyncio.sleep(4)
        content = await page.content()
        data = await new_data_extractor_from_html(content)
        return data
    except Exception as e:
        print(f"Reload error: {e}")
        return None




@app.websocket("/ws/v2")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    browser = None
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True, args=["--disable-http2"])
            context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
            
            page = await context.new_page()
            await page.goto(MEROLagani, wait_until="load", timeout=90000)
            
            while True:
                data = await new_reload_and_extract(page)
                print(data)
                print("\n")
                if data is not None:
                    await websocket.send_json(data)
                else:

                # await asyncio.sleep(2)  # Wait interval regardless of success/failure
                    await websocket.close()
    
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

import pandas as pd
import os

def fetch_price_history(SymbolNumber: str, page: int = 1):
    try:
        file_path = f"stocks_data/{SymbolNumber.upper()}.csv"
        if not os.path.exists(file_path):
            print(f"No data found for symbol: {SymbolNumber}")
            file_path = "stocks_data/ACLBSL.csv"
        df = pd.read_csv(file_path)
        page_size = 20
        start = (page - 1) * page_size
        end = start + page_size

        if start >= len(df):
            print(f"Page {page} is out of range.")
            return None

        return df.iloc[start:end]
    except Exception as e:
        print(f"fetch_price_history error: {e}")
        return None

@app.get("/{SymbolNumber}/price/{page}")
def get_price_history(SymbolNumber: str, page: int=1):
    if page<=0:
        page = 1
    if page >5:
        page =5
    data = fetch_price_history(SymbolNumber, page=page)
    if data is not None:
        return data.to_dict(orient="records")
    
    return {
        "symbol": SymbolNumber,
        "result": "Stock not found"
    }