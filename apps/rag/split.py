from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(docs):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=150)
    splits = text_splitter.split_documents(docs)

    return splits