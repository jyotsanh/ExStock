import sqlite3

# dir: Libs
from Libs.libs import *

from core.assistant import MyState, Assistant, create_entry_node

from .assistant import (
    get_course_suggest_master_assistant_runnable,
    get_exopy_course_master_assistant_runnable,
    get_primary_assistant_runnable,
    get_stock_genius_master_assistant_runnable
)

from .routes import (
        entry_workflow_routes,  
        entry_primary_assistant_routes,
        entry_course_suggest_master_assistant_routes,
        entry_exopy_course_master_assistant_routes,
    )


def build_graph(conn:sqlite3.Connection):
    try:
        builder = StateGraph(MyState)
        builder.add_edge(START,"workflow_routes")
        builder.add_node(   
                            "workflow_routes", 
                            entry_workflow_routes
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
                    "suggest_master_tools",
                    END,
                ]   
            )

        builder.add_conditional_edges(
            "stock_genius_master_assistant",
            entry_exopy_course_master_assistant_routes,
            [
                "suggest_master_tools",
                END,
            ]   
        )

        builder.add_conditional_edges(
            "exopy_course_tutor_master_assistant",
            entry_exopy_course_master_assistant_routes,
            [
                "suggest_master_tools",
                END,
            ]
        )

        memory = SqliteSaver(conn=conn)
        
        graph = builder.compile(
            checkpointer=memory, 
        )
        # from IPython.display import Image, display
        # graph.get_graph().draw_mermaid_png(output_file_path="./graph.png")
        return graph
    except Exception as e:

        print(f"[INFO] -> file `graph_building.py` -> function `build_graph`: \n{e}\n")
        return None