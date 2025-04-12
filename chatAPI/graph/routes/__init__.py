from .course_suggest_master_assistant_routes import entry_course_suggest_master_assistant_routes
from .exopy_course_master_assistant_routes import entry_exopy_course_master_assistant_routes
from .primary_assistant_routes import entry_primary_assistant_routes
from .stock_genius_master_assistant_routes import entry_stock_genius_master_assistant_routes
from .workflow_routes import entry_workflow_routes

__all__ = [
    "entry_workflow_routes",
    "entry_primary_assistant_routes",
    "entry_exopy_course_master_assistant_routes",
    "entry_course_suggest_master_assistant_routes",
    "entry_stock_genius_master_assistant_routes"

]