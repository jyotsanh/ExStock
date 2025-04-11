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
