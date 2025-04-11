from Libs.libs import *

from core.assistant import MyState

import sqlite3

def delete_thread_entries(thread_id,conn:sqlite3.Connection):
    """Deletes rows with the given thread_id from all tables containing a thread_id column."""
    try:
        cursor = conn.cursor()

        # Find tables that contain a column named 'thread_id'
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        for table in tables:
            table_name = table[0]

            # Check if table has a column named 'thread_id'
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            column_names = [col[1] for col in columns]

            if "thread_id" in column_names:
                print(f"Deleting from {table_name} where thread_id = '{thread_id}'")
                cursor.execute(f"DELETE FROM {table_name} WHERE thread_id = ?", (thread_id,))

        conn.commit()
        return "Deletion successful."
        

    except sqlite3.Error as e:
        print(f"Error: {e}")



def handle_tool_error(state) -> dict:
    error = state.get("error")
    tool_calls = state["messages"][-1].tool_calls
    return {
        "messages": [
            ToolMessage(
                content=f"Error: {repr(error)}\n please fix your mistakes.",
                tool_call_id=tc["id"],
            )
            for tc in tool_calls
        ]
    }

def create_tool_node_with_fallback(tools: list) -> dict:
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)], exception_key="error"
    )
