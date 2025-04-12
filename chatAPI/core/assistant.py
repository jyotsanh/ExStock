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
    prefers:str
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




class Assistant:
    def __init__(self, runnable: Runnable, recursion_limit: int = 4):
        self.runnable = runnable
        self.recursion_limit = recursion_limit

    def __call__(self, state: MyState, config: RunnableConfig):
        """
        Process the current state and generate a response.
        
        :param state: Current conversation state
        :param config: Runnable configuration
        :return: Updated state with assistant's response
        """
        try:
            temp_state = trim_messages(
                        messages = state["messages"],
                        strategy="last",
                        token_counter= llm,
                        max_tokens = 800,
                        start_on = "human",
                        end_on = ("human","tool"),
                    )
            # print("-----------------------START------------------------\n\n\n")
            # print(temp_state)
            # print("------------------------END--------------------\n\n\n")
            counter = 0
            state = {**state, "messages": temp_state}
            while True:
                result = self.runnable.invoke(state)
                print("TRUE loop")
                # Handle empty or invalid responses
                if not result.tool_calls and (
                    not result.content
                    or isinstance(result.content, list)
                    and not result.content[0].get("text")
                ):
                    print("no tool call , calling again")
                    messages = state["messages"] + [("user", "Respond with a real output.")]
                    state = {**state, "messages": messages}
            
                else:
                    print("breaking")
            
                    break
                if self.recursion_limit == counter:
                    print("[INFO] Recursion limit reached, invoking the tool again")
                    messages = state["messages"] + [("user", "Just invoke the tool, which you think is most relevant to the user's query")]
                    state = {**state, "messages": messages}
                    break
                counter += 1
            return {"messages": result}
        except Exception as e:
            print(f"Error in the Assistant : \n {e} \n")
    
class CompleteOrEscalate(BaseModel):
    """A tool to mark the current task as completed and/or to escalate control of the dialog to the main assistant,
    who can re-route the dialog based on the user's needs."""

    cancel: bool = True
    reason: str

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "cancel": True,
                    "reason": "User changed their mind about the current task.",
                },
                {
                    "cancel": True,
                    "reason": "I have fully completed the task.",
                },
                                {
                    "cancel": True,
                    "reason": "This task can be handled by the main assistant.",
                }
            ]
        }



class ToCourseSuggestMaster(BaseModel):
    """Transfers work to a specialized assistant When customer-queries are related asking for course suggestions based on their past progress or wants to see the courses we provide"""
    reason: str = Field(
        description="this request can be handle by this COurse Suggest assistant"
    )

class ToStockGeniusMaster(BaseModel):
    """Transfers work to a specialized assistant to Stock Genius, When customer-queries are related asking for some technique, patterns to learn."""
    reason: str = Field(
        description="this request can be handle by this assistant"
    )

class ToPersonalizedTutorMaster(BaseModel):
    """Transfers work to a specialized assistant to When customer-queries are related asking for some topics from course content."""
    reason: str = Field(
        description="this request can be handle by this assistant"
    )




def create_entry_node(assistant_name: str, new_dialog_state: str) -> Callable:    
    def entry_node(state: MyState) -> dict:
        tool_call_id = state["messages"][-1].tool_calls[0]["id"]
        return {
            "messages": [
                ToolMessage(
                    content=f"The assistant is now the {assistant_name}. Reflect on the above conversation between the host assistant and the user."
                    f" The user's intent is unsatisfied. Use the provided tools to assist the user. Remember, you are {assistant_name},"
                    " If the user changes their mind or needs help for other tasks, call the CompleteOrEscalate function to let the primary host assistant take control."
                    " Do not mention who you are - just act as the proxy for the assistant.",
                    tool_call_id=tool_call_id,
                )
            ],
            "dialog_state": new_dialog_state,
        }

    return entry_node
