# from dir: Libs/libs.py
from Libs.libs import *

# from dir: Graphs/generate_response
from graph.generate_response import generate_response

# Persistent Memory
import sqlite3
import os
path = "stateDb/checkpoints.sqlite.db"
os.makedirs(os.path.dirname(path), exist_ok=True)  # Create the directory if it doesn't exist
conn = sqlite3.connect(path, check_same_thread = False)

# from dir: Graphs/graph_building
from graph.graph_building import build_graph
graph = build_graph(conn)

if graph is None:
    print("[ERROR] -> file server.py -> function `build_graph`: Graph could not be built")
    exit(1)

# fast api server
app = FastAPI()

REDIS_SERVER = os.getenv('REDIS_SERVER') or 'localhost'

@app.get("/update_vector_store")
def update_vector_store():
    response = {
        "result":"your vector store has been updated"
    }
    return "Hi"

@app.get("/response")
def chat_response(query:str,senderId:str,metadata={},source:str="web"):
    try:
        print(f"[INFO] -> query: {query} | senderId: {senderId} | metadata: {metadata} | source: {source}")
        metadata['prefers'] = "english"
        response = generate_response(
            user_query = query,
            user_id = senderId,
            graph = graph,
            user_metadata = metadata,
            sqlite_conn = conn
        )
        if response!=None:
               
            return {
                "result":response
            }
        else:
            fallback_res = {
                "result":"Hey, there how can i help you today"
            }
            return fallback_res
            
    except Exception as e:
        print(f"[ERROR] -> file server.py -> function `generate_response`: {e}")
        response = {
            "result":"Hi, How may i assist you today?"
        }
        return response