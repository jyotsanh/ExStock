

def our_course_tool(query:str):
    """
    This function is a tool for the Course Suggest Master Assistant.
    It takes in a query string and returns a string of courses from Exopy.
    """
    try:
        print(f"[INFO] -> query: {query}")
        return "this is the course tool response"
    except Exception as e: 
        print(f"[ERROR] -> file tools/course_suggest_master_assistant_tools/exopy_courses_tools.py -> function `our_course_tool`: {e}")