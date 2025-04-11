import sqlite3

# dir: Libs
from Libs.libs import *

from core.assistant import MyState

def should_continue(state):
    return {
                "user_info":"heheheheh"
            }
def build_graph(conn:sqlite3.Connection):
    try:
        builder = StateGraph(MyState)
        builder.add_edge(START,"test_node")
        builder.add_node("test_node", should_continue)
        builder.add_edge("test_node",END)
        memory = SqliteSaver(conn=conn)
        
        graph = builder.compile(
            checkpointer=memory, 
        )
        from IPython.display import Image, display
        graph.get_graph().draw_mermaid_png(output_file_path="./graph.png")
        return graph
    except Exception as e:

        print(f"[INFO] -> file `graph_building.py` -> function `build_graph`: \n{e}\n")
        return None