


from langchain.vectorstores.chroma import Chroma
from langchain_openai import OpenAIEmbeddings


def store_documents(splits):
    vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())

    return vectorstore