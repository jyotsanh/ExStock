from models.db import VectorStore
from Libs.libs import our_course_collection_name, ChatPromptTemplate, RunnableMap,get_llm

vector_store = VectorStore(
            collection_name=our_course_collection_name, store_type="milvus").get_vector_store()

def our_course_tool(query:str):
    """
    This tool is a tool for the Exopy Course Master Assistant.
    it returns the similar courses to the query, asked by user from vector store
    """
    try:
        print(f"[INFO] -> our course assistatn ->query: {query}")
        
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
        context = vector_store.similarity_search(query,k=5)
        chain = RunnableMap({
            'query': lambda x: x['query'],
            "context": lambda x: context
        }) | prompt | llm 

        res = chain.invoke({"query": query})
        print(context)
        return res
    except Exception as e: 
        print(f"[ERROR] -> file tools/course_suggest_master_assistant_tools/exopy_courses_tools.py -> function `our_course_tool`: {e}")