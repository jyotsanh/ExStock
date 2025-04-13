import requests
def get_live_data_right_now(symbol:str):
    data = requests.get(f"http://192.168.100.88:8015/{symbol}")
    data = data.json()
    print("--------------------------")
    print(data)
    print("--------------")
    
    if data.get('Error',None) == "heheh":
        return f"didn't get any data on the {symbol}, my stock domain only ranges upto nepse nepal stock market"
    if data!=None:
        return data
    else:
        print("returning the error")
        return f"didn't get any data on the {symbol}, my stock domain only ranges upto nepse nepal stock market"


def get_stock_info_tool(symbol):
    
    """
    This function takes a stock symbol as input and returns the latest stock information for the given symbol.
    If the information is not available, it will return None.
    """
    
    try:
        print(f"[INFO] -> symbol: {symbol}")
        symbol_data = get_live_data_right_now(symbol)
        if symbol_data is not None:
            print(symbol_data)
            return symbol_data
        else:
            return symbol_data
    except Exception as e:
        print(f"[ERROR] -> file tools/stock_genius_master_assistant_tools/get_stock_info.py -> function `get_stock_info_tool`: {e}")
        return f"didn't get any data on the {symbol}, my stock domain only ranges upto nepse nepal stock market"



if __name__ == "__main__":
    print(get_live_data_right_now("HBL"))