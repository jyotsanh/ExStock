from Libs.libs import *

from core.assistant import MyState, ToCourseSuggestMaster, ToExopyCourseTutorMaster, ToStockGeniusMaster


def entry_primary_assistant_routes(state:MyState):
# tools conditon takes state and check the last message in the state, and return "tools" if there is a tool call, otherwise return "__end__".
    route = tools_condition(state)
    if route == END:
        print(f"[INFO] -> primary_assistant going to -> ``__end__`` ")
        return END
    
    tool_calls = state["messages"][-1].tool_calls
    if len(tool_calls)>1:
        print("Mistake condition found and solved...")
        print(tool_calls)
        tool_calls =  [tool_calls[0]]
        state["messages"][-1].tool_calls = tool_calls
    if tool_calls:
        print(f"[INFO]-> primary_assistant calls going to -> ``{tool_calls}`` ")

        tool_name = tool_calls[0]['name']

        tool_routes = {
            ToCourseSuggestMaster.__name__: "update_stack_course_suggest",
            ToStockGeniusMaster.__name__: "update_stack_stock_genius",
            ToExopyCourseTutorMaster.__name__: "update_stack_exopy_course_tutor",
        }

        return tool_routes.get(tool_name, "primary_assistant_tools")

    raise ValueError("Invalid route")