import numpy as np
from constants import SETTINGS
from langchain_openai import OpenAIEmbeddings


def generate_embedding(doc):
    """
    Generate the embedding for the given document
    """
    embeddings_model = OpenAIEmbeddings(api_key=SETTINGS.openai_api_key.get_secret_value())
    return embeddings_model.embed_documents(doc)[0]


def generate_benchmark_embeddings(benchmark_content):
    embeddings = []
    for benchmark in benchmark_content:

        embedding = generate_embedding([benchmark['summary']])
        embeddings.append(embedding)  
    return embeddings


def calculate_max_dot_product(embedding, benchmark_embeddings):

  max_dot_product = 0
  for benchmark in benchmark_embeddings:
    dot_product = np.dot(embedding, benchmark)

    if dot_product > max_dot_product:
        max_dot_product = dot_product

  return max_dot_product