from Libs.libs import *

from graph.tools import knowledge_of_stocks, get_stock_info_tool


from core.assistant import *
genius_assistant_tools = [
    knowledge_of_stocks,
    get_stock_info_tool
]

from prompts import STOCK_GENIUS_ASSISTANT
def get_stock_genius_master_assistant_runnable():
    genius_master_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                STOCK_GENIUS_ASSISTANT
            ),
            ("placeholder", "{messages}"),
        ]
    )

    genius_master_runnable = genius_master_prompt | llm.bind_tools(
        genius_assistant_tools + [CompleteOrEscalate]
    )

    return genius_master_runnable
