from Libs.libs import *

from graph.tools import our_tutor_tool


from core.assistant import *
tutor_assistant_tools = [
    our_tutor_tool
]

from prompts import TUTOR_ASSISTANT_PROMPT
def get_exopy_course_master_assistant_runnable():
    tutor_assistant_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                TUTOR_ASSISTANT_PROMPT
            ),
            ("placeholder", "{messages}"),
        ]
    )

    tutor_assistant_runnable = tutor_assistant_prompt | llm.bind_tools(
        tutor_assistant_tools + [CompleteOrEscalate]
    )

    return tutor_assistant_runnable
