from Libs.libs import *

def get_llm(model_name:str="gpt-4o-mini",temperature=0.6):
    if model_name == "gpt-4o-mini":
        return ChatOpenAI(
                    api_key = "45678dfghjcvbn",
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
    pass
