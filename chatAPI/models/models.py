from Libs.libs import *

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")

def get_llm(model_name:str="openai",temperature=0.6):
    if model_name == "gpt-4o-mini":
        return ChatOpenAI(
                    api_key = OPENAI_KEY,
                    model=model_name,
                    temperature=temperature
                )
    elif model_name == "gemini":
        return ChatOpenAI(
                    api_key = "45678dfghjcvbn",
                    model=model_name,
                    temperature=temperature
        )

def get_embeddings():
    embeddings=OpenAIEmbeddings(api_key=OPENAI_KEY )
    return embeddings        

