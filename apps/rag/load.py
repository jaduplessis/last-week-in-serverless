from langchain_community.document_loaders import JSONLoader


def metadata_func(record: dict, metadata: dict) -> dict:
    
    metadata["title"] = record["title"]
    metadata["source"] = record["link"]
    metadata["pubDate"] = record["pubDate"]
    metadata["category"] = record["category"]
    metadata["relevance"] = record["relevance"]
    
    return metadata


def load_documents(file):
       
    loader = JSONLoader(
        file_path=file,
        jq_schema='.items[]',
        content_key='content',
        metadata_func=metadata_func,
    )

    data = loader.load()

    return data
