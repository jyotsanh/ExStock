from Libs.libs import *

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")
print(OPENAI_KEY)
def get_llm(model_name:str="openai",temperature=0.6):
    try:
        if model_name == "openai":
            return ChatOpenAI(
                        api_key = OPENAI_KEY,
                        model="gpt-4o-mini",
                        temperature=temperature
                    )
        elif model_name == "gemini":
            return ChatOpenAI(
                        api_key = "45678dfghjcvbn",
                        model=model_name,
                        temperature=temperature
            )
    except Exception as e:
        print(f"[ERROR] -> file models.py -> function `get_llm` : \n {e} \n")
def get_embeddings():
    embeddings=OpenAIEmbeddings(api_key=OPENAI_KEY )
    return embeddings        

