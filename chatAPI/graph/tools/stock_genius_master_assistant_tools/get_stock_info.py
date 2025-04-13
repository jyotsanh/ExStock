import requests
def get_live_data_right_now(symbol:str):
    data = requests.get(f"http://192.168.100.88:8015/{symbol}")
    if data!=None:
        return data.json()
    else:
        return None


def get_stock_info_tool(symbol):
    
    """
    This function takes a stock symbol as input and returns the latest stock information for the given symbol.
    If the information is not available, it will return None.
    """
    
    try:
        symbol_data = get_live_data_right_now(symbol)
        if symbol_data is not None:
            print(symbol_data)
            return symbol_data
    except Exception as e:
        print(f"[ERROR] -> file tools/stock_genius_master_assistant_tools/get_stock_info.py -> function `get_stock_info_tool`: {e}")



if __name__ == "__main__":
    print(get_live_data_right_now("HBL"))