# dir: Libs 
from Libs.libs import *

# file: prompts.py
from prompts import PRIMARY_ASSISTANT_PROMPT

# dir: core
from core.assistant import *

def get_primary_assistant_runnable():
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