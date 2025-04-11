from typing import Optional, Dict
from fastapi import Query
from pydantic import BaseModel, Field
class QueryInput(BaseModel):
    query:str = Field(description="query to be passed as an argument, always use this.")

  
class StoreArguments(BaseModel):
    path: str = Field(
        ..., description="List of dictionaries containing data to store. Each dictionary should have a 'content' key with the actual content."
    )
    collection_name: str = Field(
        ..., description="Name of the collection to store the data in. Follows the format 'general_store_<id>'."
    )
    store_type: str = Field(
        "milvus", description="Type of storage to use. Defaults to 'milvus'."
    )
