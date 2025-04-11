# dir: Libs/libs.py
from Libs.libs import *

# dir: core/assistant
from core.assistant import MyState

def entry_workflow_routes(
        state:MyState,
    )->Literal[
        "primary_assistant",
        "course_suggest_master_assistant",
        "stock_genius_master_assistant",
        "exopy_course_tutor_master_assistant",
    ]:
    dialog_state = state.get("dialog_state")
    if not dialog_state :
        print(f"[INFO] -> Nothing in dialogue state going to -> ``primary_assistant`` ")
        return "primary_assistant"
    
    print(f"[INFO] ->dialogue state going to -> ``{dialog_state[-1]}`` ")
    return dialog_state[-1]

