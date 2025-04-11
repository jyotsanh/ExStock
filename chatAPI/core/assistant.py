from Libs.libs import *


def update_dialog_stack(left: list[str], right: Optional[str]) -> list[str]:
    """Push or pop the state."""
    if right is None:
        return left
    if right == "pop":
        return left[:-1]
    return left + [right]


class MyState(TypedDict):
    messages: Annotated[list[AnyMessage], add_messages]
    user_info: str
    current_message:str
    dialog_state: Annotated[
        list[
            Literal[
                "primary_assistant",
                "course_suggest_master_assistant",
                "stock_genius_master_assistant",
                "exopy_course_master_assistant",
            ]
        ],
        update_dialog_stack,
    ]
