from typing import Optional, Dict
from fastapi import Query
from pydantic import BaseModel, Field
class QueryInput(BaseModel):
    query:str = Field(description="query to be passed as an argument, always use this.")
