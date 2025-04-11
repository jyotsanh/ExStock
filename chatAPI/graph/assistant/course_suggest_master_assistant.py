# dir: Libs 
from Libs.libs import *

# file: prompts.py
from prompts import COURSE_SUGGEST_MASTER_ASSISTANT

# dir: core
from core.assistant import *

from graph.tools import our_course_tool

course_suggest_master_tools = [
    our_course_tool
]

def get_course_suggest_master_assistant_runnable():
    course_suggest_assistant_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                COURSE_SUGGEST_MASTER_ASSISTANT
            ),
            ("placeholder", "{messages}"),
        ]
    )

    course_suggest_assistant_runnable = course_suggest_assistant_prompt | llm.bind_tools(
        course_suggest_master_tools + [CompleteOrEscalate]
    )
    return course_suggest_assistant_runnable