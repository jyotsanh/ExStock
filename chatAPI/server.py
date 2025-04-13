# from dir: Libs/libs.py
from Libs.libs import *

# from dir: Graphs/generate_response
from graph.generate_response import generate_response

from models.vector_store_creator import (
                                update_genius_store,
                                update_ai_tutor,
                                update_our_course
                                )
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


from schema.schema import StoreName
from fastapi.middleware.cors import CORSMiddleware
# fast api server
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
REDIS_SERVER = os.getenv('REDIS_SERVER') or 'localhost'

@app.get("/update_vector_store")
def update_vector_store(store:StoreName):
    store_updates = {
        StoreName.stock_genius: (update_genius_store, 'Genius Assistatn store updated'),
        StoreName.ai_tutor: (update_ai_tutor, 'AI tutor store updated'),
        StoreName.course_seller: (update_our_course, 'Our Course store updated'),

    }

    if store in store_updates:
        function_name, return_message = store_updates[store]
        function_name()
        response = {
            "result":return_message
        }
        return response
    else:
        response = {
            "result":"Store not found"
        }
        return response

@app.get("/response")
def chat_response(query:str,senderId:str,metadata={},source:str="web"):
    try:
        print(f"[INFO] -> query: {query} | senderId: {senderId} | metadata: {metadata} | source: {source}")
        if isinstance(metadata, str):
            
            metadata = json.loads(metadata) if metadata else {}
            
        # metadata['prefers'] = "english"

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
        print(f"[ERROR] -> file server.py -> function `chat_response`: {e}")
        response = {
            "result":"Hi, How may i assist you today?"
        }
        return response

@app.get("/tresponse")
def chat_response(query:str,senderId:str,metadata={},source:str="web"):
    try:
        print(f"[INFO] -> query: {query} | senderId: {senderId} | metadata: {metadata} | source: {source}")
        if isinstance(metadata, str):
            print(f"metadat {metadata}")
            metadata = json.loads(metadata) if metadata else {}
            print(f"metadat {metadata}")
            return {
                "result":query,
                "Metadat":metadata,
                "SENDER":senderId
            }
        else:
            fallback_res = {
                "result":"Hey, there how can i help you today"
            }
            return fallback_res
            
    except Exception as e:
        print(f"[ERROR] -> file server.py -> function `chat_response`: {e}")
        response = {
            "result":"wrong vayo!!"
        }
        return response