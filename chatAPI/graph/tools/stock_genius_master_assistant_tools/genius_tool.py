from models.db import VectorStore
from Libs.libs import genius_collection_name, ChatPromptTemplate, RunnableMap,get_llm
vector_store = VectorStore(
    collection_name=genius_collection_name, store_type="milvus").get_vector_store()

def knowledge_of_stocks(query:str):
    """
    This function is a tool for the stock genius master assistant.
    It takes in a query string and returns a string of knowledge of stocks.
    """
    try:
        print(f"[INFO] -> knowledge stock genius ->query: {query}")

        template = """
                Analyze the context fullly and nicely and answer the user query fromt the context.
                ### Context is given in double backticks: ``{context}``
                ### User query is given in triple backticks: ```{query}```
                Response should always be in markdown format, in english and should not contain any backticks. 
                if the prices is not present in the context, search if any other information is available in the context related to the query. If available return what is given in the context about the query.
                Do not ever mention in the context in your response.
        """
        llm = get_llm(model_name='openai')
        prompt = ChatPromptTemplate.from_template(template=template)

        chain = RunnableMap({
            'query': lambda x: x['query'],
            "context": lambda x: vector_store.similarity_search(query,k=5)
        }) | prompt | llm 

        res = chain.invoke({"query": query})
        print(res)
        return res
    except Exception as e:
        print(f"[ERROR] -> file tools/stock_genius_master_assistant_tools/genius_tool.py -> function `knowledge_of_stocks`: {e}")
        