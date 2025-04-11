# dir: Libs 
from Libs.libs import (
    ChatPromptTemplate,
    llm
)

# file: prompts.py
from prompts import PRIMARY_ASSISTANT_PROMPT

# dir: core
from core.assistant import *

def get_primary_assistant_runnable():
    try:
        primary_assistant_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    PRIMARY_ASSISTANT_PROMPT
                ),
                ("placeholder", "{messages}"),
            ]
        )


        primary_assistant_runnable = primary_assistant_prompt | llm.bind_tools(

            [
                ToCourseSuggestMaster,
                ToStockGeniusMaster,
                ToExopyCourseTutorMaster,
            ]
        )
        return primary_assistant_runnable
    except Exception as e:
        print(f"[ERROR] -> file primary_assistant.py -> function `get_primary_assistant_runnable` : \n {e} \n")
        return None