from Libs.libs import *

from graph.utility import delete_thread_entries
import sqlite3

def generate_response(
        user_query:str,
        user_id:str,
        graph:Runnable,
        user_metadata:dict,
        sqlite_conn:sqlite3.Connection,
    ):
    try:
        print("ghjk")
        config = {
            "configurable":{
                "thread_id":user_id,
                
            },
            "recursion_limit":10,
        }
        response = graph.invoke(
                {
                    'messages': ('user', user_query),
                    'user_info': user_metadata,
                    'prefers':user_metadata.get('prefers','english') # -> gets the prefers language otherwise fallback to english
                },
                config
            )
        if isinstance(response["messages"][-1],HumanMessage):
            delete_thread_entries(user_id,sqlite_conn)
            print("Human message, AI message FOUND")
            return "Hi, there, How may I help you today?"
        

        return response
    except Exception as e:
        print(f"[INFO] -> file `generate_response.py` -> function `generate_response`: \n{e}\n")
        return None