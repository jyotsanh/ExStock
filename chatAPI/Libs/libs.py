import ast
import os
import json
import requests
import re
import redis
import pprint
import uvicorn
import email.message, smtplib

from dotenv import load_dotenv, find_dotenv
from typing import Optional,List, Annotated, Literal, Callable, Union
from typing_extensions import TypedDict
from fastapi import FastAPI

# libs
from datetime import datetime
from pydantic import BaseModel,Field
from functools import lru_cache

# langchain core
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage,trim_messages
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import RunnableConfig, Runnable, RunnableLambda
from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langchain_core.messages import RemoveMessage
from langchain_core.messages import (
    MessageLikeRepresentation,
)
Messages = Union[list[MessageLikeRepresentation], MessageLikeRepresentation]

from langchain_text_splitters import RecursiveJsonSplitter
from langchain_openai import ChatOpenAI

# langchain:
from langchain.schema import Document
from langchain.prompts import PromptTemplate
from langchain.tools import Tool,StructuredTool
from langchain.schema.runnable import RunnableMap
from langchain.memory import ConversationBufferMemory
from langchain.memory import ConversationSummaryMemory
from langchain.agents import create_tool_calling_agent, AgentExecutor

# langchain llm
from langchain_openai.embeddings import OpenAIEmbeddings

# Text Splitters:
from langchain.text_splitter import CharacterTextSplitter,RecursiveCharacterTextSplitter

# langchain community
from langchain_community.vectorstores.chroma import Chroma
# from langchain_community.vectorstores.milvus import Milvus
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.callbacks.manager import get_openai_callback
from langchain_community.document_loaders import TextLoader

# vector stores:
from langchain_milvus import Milvus
from langchain_milvus.retrievers import MilvusCollectionHybridSearchRetriever

# dir: models imports
from models import get_llm, get_embeddings

# dir: Schema imports 
from schema import *

# langgraph
from langgraph.graph import END, StateGraph, START
from langgraph.graph.message import AnyMessage, add_messages
from langgraph.prebuilt import ToolNode,tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.sqlite import SqliteSaver

REDIS_SERVER=os.getenv('REDIS_SERVER')  or 'localhost'
llm = get_llm(
                model_name='gpt-4o-mini'
                
                )
embeddings = get_embeddings()

# Parser to parse the output
string_parser= StrOutputParser()
json_parser = JsonOutputParser()


# dir: models/model.py
from models import VectorStore

load_dotenv()
LOCAL_HOST = os.getenv("LOCAL_HOST")
LOCAL_PORT = os.getenv("LOCAL_PORT")

OPENAI_KEY = os.getenv("OPENAI_KEY")

llm = get_llm(
            model_name='openai',
            temperature=0.6,
            )