from Libs.libs import *

from graph.tools import our_tutor_tool


from core.assistant import *
tutor_assistant_tools = [
    our_tutor_tool
]

from prompts import COURSE_SUGGEST_MASTER_ASSISTANT
def get_exopy_course_master_assistant_runnable():
    tutor_assistant_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                COURSE_SUGGEST_MASTER_ASSISTANT
            ),
            ("placeholder", "{messages}"),
        ]
    )

    tutor_assistant_runnable = tutor_assistant_prompt | llm.bind_tools(
        tutor_assistant_tools + [CompleteOrEscalate]
    )

    return tutor_assistant_runnable
