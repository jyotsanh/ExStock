from Libs.libs import *

from .models import get_llm, get_embeddings

from schema import StoreArguments

class VectorStore:
    def __init__(self, **kwargs:StoreArguments):
        self.store_type: str = kwargs.get('store_type',None)
        self.host=os.getenv('LOCAL_HOST') # -> LOCAL_HOST, HOST, LOCAL_SERVER_HOST
        self.port=os.getenv('LOCAL_PORT') # -> LOCAL_PORT, PORT, LOCAL_SERVER_PORT
        self.URI = f"http://{self.host}:{self.port}"
        self.path: str =kwargs.get('path')
        self.collection_name: str =  kwargs.get('collection_name',None)
        self.embeddings = get_embeddings()
        self.docs = []
        self.csv_docs = []
        self.pdf_docs = []
        self.json_docs = []
        
    
    

    def create_document(self, maxchunk_size:int= 100):
        # To get the file path (csv, pdf, json only works for now)
        file_type = self.path.split(".")[-1]
        
        if file_type == "csv":
            loader = CSVLoader(self.path)
            csv_data = loader.load_and_split()
            for i in range(len(csv_data)):
                self.csv_docs = self.csv_docs + [Document(page_content=csv_data[i].page_content)]
            print(self.csv_docs)
            return self.csv_docs
        
        elif file_type == "pdf":
            loader = CSVLoader(self.path)
            loader = CSVLoader(self.path)
            pdf_data = loader.load_and_split()
            for i in range(len(pdf_data)):
                self.pdf_docs = self.docs + [Document(page_content=pdf_data[i].page_content)]
            return self.pdf_docs
            print(self.pdf_docs)
            
        elif file_type == "json":
            with open(self.path, "r") as f:
                docs_json = json.load(f)
            print(f"Path is {self.path}-----\n")
            # service_centers = docs_json.get("service_centers", [])
            splitter = RecursiveJsonSplitter(max_chunk_size=maxchunk_size)
            splited_json = splitter.split_json(docs_json)
            print(f"Max chunk size : {maxchunk_size}\n\n")
            print(len(splited_json))
            json_documents = splitter.create_documents(splited_json,)
            
            for i in range(len(json_documents)):
                self.json_docs = self.json_docs + [Document(page_content=json_documents[i].page_content)]
            return self.json_docs
        
        else:
            return f"file type error. Allowed file types are .csv, .pdf, .json only "  

    def create_vector_store(self,max_chunk_size):
        if str.lower(self.store_type) == "milvus":
            print("Milvus")
            print(f"http://{self.host}:{self.port}")
            splits = self.create_document(maxchunk_size=max_chunk_size)
            pprint.pprint(splits)
            vectorstore_milvus=Milvus.from_documents(embedding=self.embeddings, 
                                                        documents=splits, connection_args={
                                                            "uri":f"http://{self.host}:{self.port}",
                                                        
                                                            },
                                                        collection_name=self.collection_name)
            return vectorstore_milvus
        elif str.lower(self.store_type) == "chroma":
            splits = self.create_document()
        # embeddings = HuggingFaceEmbeddings(model_name="mixedbread-ai/mxbai-embed-large-v1", encode_kwargs = {'normalize_embeddings': True}) 
            vectorstore_chroma = Chroma.from_documents(
                documents=splits,
            embedding=self.embeddings,persist_directory=f"./{self.collection_name}")

            return vectorstore_chroma

    def get_vector_store(self):
        try:
            if str.lower(self.store_type) == "milvus":
                print(f"Milvus -> {self.collection_name}")
                print(f"http://{self.host}:{self.port}")
                
                vectorstore=Milvus(
                    embedding_function=self.embeddings,
                    connection_args={
                        "uri":self.URI,
                        },
                    collection_name=self.collection_name
                    )
                return vectorstore

            elif str.lower(self.store_type) == "chroma":
                print("Chroma")

                # emb = HuggingFaceEmbeddings(model_name="mixedbread-ai/mxbai-embed-large-v1", encode_kwargs = {'normalize_embeddings': True}) 
                vectorstore = Chroma(
                    embedding_function=self.embeddings,persist_directory=self.collection_name
                    )
                return vectorstore
            else:
                print("The vector store you are looking for does not exist. Please create a new one or correct the collection name of the vector store")
        except Exception as e :
            print("Exception", e)
        
    