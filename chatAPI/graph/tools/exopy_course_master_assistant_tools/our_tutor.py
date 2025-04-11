def our_tutor_tool(query:str):
    """
    This function is a tool for the Exopy Course Master Assistant.
    It takes in a query string and returns a string of knowledge of the tutor.
    """
    try:
        print(f"[INFO] -> query: {query}")
        return "this is the tutor tool response"
    except Exception as e:
        print(f"[ERROR] -> file tools/exopy_course_master_assistant_tools/our_tutor.py -> function `our_tutor_tool`: {e}")