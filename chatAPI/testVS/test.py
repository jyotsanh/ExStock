from pymilvus import MilvusClient
from dotenv import load_dotenv
import os
load_dotenv()

LOCAL_HOST = os.getenv("LOCAL_HOST")
LOCAL_PORT = os.getenv("LOCAL_PORT")

lOCAL_URL = f"http://{LOCAL_HOST}:{LOCAL_PORT}"

def test_list_collection(URL):
# Initialize the Milvus client
    print(f"Test Listing the collection from the Milvus server at \n >>>>> {URL} <<<<<<")
    client = MilvusClient(
        uri=URL,  # Replace with your Milvus server address
            # Replace with your access token if authentication is enabled
    )

    # Retrieve and print the list of collections
    collections = client.list_collections()
    print(collections)

if __name__ == "__main__":
    test_list_collection(lOCAL_URL)