# dir: Libs 
from Libs.libs import (
    ChatPromptTemplate,
)

# file: prompts.py
from prompts import PRIMARY_ASSISTANT_PROMPT

# dir: core
from core.assistant import *

def get_primary_assistant_runnable():
    try:
        print("heheh")
        primary_assistant_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    PRIMARY_ASSISTANT_PROMPT
                ),
                ("placeholder", "{messages}"),
            ]
        )

        llm = get_llm(
                model_name='openai'
                
                )
        primary_assistant_runnable = primary_assistant_prompt | llm.bind_tools(

            [
                ToCourseSuggestMaster,
                ToStockGeniusMaster,
                ToPersonalizedTutorMaster,
            ]
        )
        return primary_assistant_runnable
    except Exception as e:
        print(f"[ERROR] -> file primary_assistant.py -> function `get_primary_assistant_runnable` : \n {e} \n")
        return None