import sqlite3


# dir: Libs
from Libs.libs import *

from core.assistant import MyState, Assistant, create_entry_node

from graph.utility import create_tool_node_with_fallback, pop_dialog_state

from .assistant import (
    get_course_suggest_master_assistant_runnable,
    get_exopy_course_master_assistant_runnable,
    get_primary_assistant_runnable,
    get_stock_genius_master_assistant_runnable,


    course_suggest_master_tools,
    genius_assistant_tools,
    tutor_assistant_tools,
)

from .routes import (
        entry_workflow_routes,  
        entry_primary_assistant_routes,
        entry_course_suggest_master_assistant_routes,
        entry_exopy_course_master_assistant_routes,
        entry_stock_genius_master_assistant_routes
    )

def dumm_node(state:MyState):
    return {}

def build_graph(conn:sqlite3.Connection):
    try:
        builder = StateGraph(MyState)
        builder.add_edge(START,"workflow_routes")
        builder.add_node(   
                            "workflow_routes", 
                            dumm_node
                        )

        builder.add_conditional_edges(
            "workflow_routes",
            entry_workflow_routes,
            [                    
                "primary_assistant",
                "course_suggest_master_assistant",
                "stock_genius_master_assistant",
                "exopy_course_tutor_master_assistant",
            ]
        )
        builder.add_node("primary_assistant",Assistant(get_primary_assistant_runnable()))
        builder.add_node("course_suggest_master_assistant",Assistant(get_course_suggest_master_assistant_runnable()))
        builder.add_node("stock_genius_master_assistant",Assistant(get_stock_genius_master_assistant_runnable()))
        builder.add_node("exopy_course_tutor_master_assistant",Assistant(get_exopy_course_master_assistant_runnable()))

        builder.add_conditional_edges(
            "primary_assistant",
            entry_primary_assistant_routes,
            [
                "update_stack_course_suggest",
                "update_stack_stock_genius",
                "update_stack_exopy_course_tutor",
                END,
            ]
        )

        builder.add_node(
            "update_stack_course_suggest",
            create_entry_node(
                    "Stock Course Suggest Assistant", "course_suggest_master_assistant"
                )
            )
            
        builder.add_node(
            "update_stack_stock_genius",
            create_entry_node(
                "Stock Genius Assistant", "stock_genius_master_assistant"
            )
        )

        builder.add_node(
            "update_stack_exopy_course_tutor",
            create_entry_node(
                "Stock Genius Assistant", "exopy_course_tutor_master_assistant"
            )
        )



        builder.add_edge(
            "update_stack_course_suggest","course_suggest_master_assistant"
        )

        builder.add_edge(
            "update_stack_stock_genius","stock_genius_master_assistant"
        )

        builder.add_edge(
            "update_stack_exopy_course_tutor","exopy_course_tutor_master_assistant"
        )


        builder.add_conditional_edges(
                "course_suggest_master_assistant",
                entry_course_suggest_master_assistant_routes,
                [
                    "course_suggester_tools",
                    "leaveskill",
                    END,
                ]   
            )

        builder.add_conditional_edges(
            "stock_genius_master_assistant",
            entry_stock_genius_master_assistant_routes,
            [
                "stock_genius_tutor_tools",
                "leaveskill",
                END,
            ]   
        )

        builder.add_conditional_edges(
            "exopy_course_tutor_master_assistant",
            entry_exopy_course_master_assistant_routes,
            [
                "exopy_course_tutor_tools",
                "leaveskill",
                END,
            ]
        )

        builder.add_node("leaveskill",pop_dialog_state)
        builder.add_edge("leaveskill","primary_assistant")
        
        builder.add_node(
                "stock_genius_tutor_tools", # -> knows everything about stock
                create_tool_node_with_fallback(genius_assistant_tools)
            )
        
        builder.add_node(
                "course_suggester_tools", # -> suggest the course a person should  use should take
                create_tool_node_with_fallback(course_suggest_master_tools)
        )
        
                
        builder.add_node(
                "exopy_course_tutor_tools", # -> helps person in our course tutor
                create_tool_node_with_fallback(tutor_assistant_tools)
            )
        

        builder.add_edge(
            "stock_genius_tutor_tools","stock_genius_master_assistant"
        )

        builder.add_edge(
            "course_suggester_tools","course_suggest_master_assistant"
        )

        builder.add_edge(
            "exopy_course_tutor_tools","exopy_course_tutor_master_assistant"
        )

        memory = SqliteSaver(conn=conn)
        
        graph = builder.compile(
            checkpointer=memory
        )
        from IPython.display import Image, display
        graph.get_graph().draw_mermaid_png(output_file_path="./graph.png")
        return graph
    except Exception as e:

        print(f"[INFO] -> file `graph_building.py` -> function `build_graph`: \n{e}\n")
        return None