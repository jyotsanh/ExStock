from Libs.libs import *

from core.assistant import MyState,CompleteOrEscalate



def entry_stock_genius_master_assistant_routes(state:MyState):
    route = tools_condition(state)
    if route == END:
        print(f"[INFO] -> stock_genius_master_assistant going to -> ``__end__`` ")
        return END
    
    tool_calls = state["messages"][-1].tool_calls
    if len(tool_calls)>1:
        print("Mistake condition found and solved...")
        print(tool_calls)
        tool_calls =  [tool_calls[0]]
        state["messages"][-1].tool_calls = tool_calls
    did_cancel = any(tc["name"] == CompleteOrEscalate.__name__ for tc in tool_calls)
    if did_cancel:
        print(f"[INFO]-> stock_genius_master_assistant calls going to -> leaveskill -> main agent ")
        return 'leaveskill'

    return 'stock_genius_tutor_tools'