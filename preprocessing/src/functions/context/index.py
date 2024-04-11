import json

import numpy as np
from constants import SETTINGS
from functions.embeddings.embed import (calculate_max_dot_product,
                                        generate_benchmark_embeddings,
                                        generate_embedding)
from functions.summary.index import generate_summary


def load_data(input_file):
  with open(input_file, 'r') as f:
    data = json.load(f)
  
  return data['items']


def generate_context_file():
  new_content = load_data(SETTINGS.whats_new_file)
  benchmark_content = load_data(SETTINGS.benchmark_data_file)

  context = {
    'items': []
  }

  benchmark_embeddings = generate_benchmark_embeddings(benchmark_content)
  
  for item in new_content:
    embedding = generate_embedding([item['summary']])

    max_dot_product = calculate_max_dot_product(embedding, benchmark_embeddings)
    
    item['relevance'] = max_dot_product
    print('Max dot product: ', max_dot_product)
    print('\n======================\n')

    context['items'].append(item)
  
    save_context(context)
  
  return new_content


def save_context(context):
  # Order context by relevance
  context['items'] = sorted(context['items'], key=lambda x: x['relevance'], reverse=True)
  with open(SETTINGS.dot_products_file, 'w') as f:

    json.dump(context, f, indent=2)