from Libs.libs import genius_collection_name, ai_tutor_collection_name, our_course_collection_name


from dotenv import load_dotenv
load_dotenv()
import os


from models.db import VectorStore

def update_genius_store():
    genius_instance = VectorStore(
        store_type="milvus",
        collection_name=genius_collection_name,
        path = "data/stock_book.pdf"
    )
    genius_instance.create_vector_store(max_chunk_size=200)
    return "genius store updated"



def update_ai_tutor():
    ai_tutor_instance = VectorStore(
        store_type="milvus",
        collection_name=ai_tutor_collection_name,
        path = "data/stock_book.pdf"
    )
    ai_tutor_instance.create_vector_store(max_chunk_size=200)
    return "ai tutor store updated"


def update_our_course():
    our_course_instance = VectorStore(
        store_type="milvus",
        collection_name=our_course_collection_name,
        path = "data/courses.json"
    )
    our_course_instance.create_vector_store(max_chunk_size=200)
    return "our course store updated"