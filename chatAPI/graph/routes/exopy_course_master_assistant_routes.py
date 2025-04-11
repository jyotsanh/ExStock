
from core.assistant import MyState, CompleteOrEscalate

from Libs.libs import *

def entry_exopy_course_master_assistant_routes(state:MyState):
    route = tools_condition(state)
    if route == END:
        print(f"[INFO] -> END of comparison Agent going to -> ``{route}`` ")
        return END
    tool_calls = state["messages"][-1].tool_calls
    if len(tool_calls)>1:
        print(tool_calls)
        print("Mistake condition found and solved...")
        tool_calls =  [tool_calls[0]]
        state["messages"][-1].tool_calls = tool_calls
    did_cancel = any(tc["name"] == CompleteOrEscalate.__name__ for tc in tool_calls)
    if did_cancel:
        print(f"[INFO]-> exopy_course_master_assistant calls going to -> leaveskill -> main agent ")
        return "leaveskill"
    print(f"[INFO]-> exopy_course_master_assistant calls going to ``exopy_course_master_assistant tools`` ") # -> comparisonTool
    return "comparisonTool" # -> comparisonTool, cg_motors_comparison_tool