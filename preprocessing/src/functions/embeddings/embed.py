import numpy as np
from langchain_openai import OpenAIEmbeddings

from constants import SETTINGS


def generate_embedding(doc):
    """
    Generate the embedding for the given document
    """
    embeddings_model = OpenAIEmbeddings(api_key=SETTINGS.openai_api_key.get_secret_value())
    return embeddings_model.embed_documents(doc)[0]


def generate_benchmark_embeddings(benchmark_content):
    content_embeddings = []
    title_embeddings = []
    summary_embeddings = []

    print('Generating embeddings for example content...')
    for example in benchmark_content:
        print(f'Generating embeddings for: {example["title"]}')
        for field in ['content', 'title', 'summary']:
            embedding = generate_embedding([example[field]])
            if field == 'content':
                content_embeddings.append(embedding)
            elif field == 'title':
                title_embeddings.append(embedding)
            else:
                summary_embeddings.append(embedding)  
    return content_embeddings, title_embeddings, summary_embeddings


def calculate_dot_product(content, benchmark_embeddings):


  target_embedding = generate_embedding([content])

  print(f'Calculating dot product for: {content[:50]}...')

  dot_products = []
  for example in benchmark_embeddings:
    dot_product = np.dot(target_embedding, example)

    print(f'Dot product: {dot_product}')

    dot_products.append(dot_product)

  return dot_products