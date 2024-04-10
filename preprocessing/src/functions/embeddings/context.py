import json

import numpy as np

from constants import SETTINGS
from functions.embeddings.embed import (calculate_dot_product,
                                        generate_benchmark_embeddings,
                                        generate_embedding)
from functions.summary.index import generate_summary


def generate_summaries():
  with open(SETTINGS.whats_new_output, 'r') as f:
    data = json.load(f)

  for item in data:
    print(f'Generating summary for: {item["title"]}. Item {data.index(item)}/{len(data)}')
    content = item['content']
    summary = generate_summary(content)
    item['summary'] = summary

    with open(SETTINGS.whats_new_output, 'w') as f:
      json.dump(data, f, indent=2)


def load_data(input_file):
  with open(input_file, 'r') as f:
    data = json.load(f)
  
  example_data = []
  for item in data:
    example_data.append({
      'title': item['title'],
      'content': item['content'],
      'summary': item['summary']
    })

  return example_data


def generate_context_file():
  new_content = load_data(SETTINGS.whats_new_output)
  benchmark_content = load_data(SETTINGS.rss_feed_file)

  context = {
    'items': []
  }

  content_embeddings, title_embeddings, summary_embeddings = generate_benchmark_embeddings(benchmark_content)
  
  for item in new_content:
    dot_product_content = calculate_dot_product(item['content'], content_embeddings)
    dot_product_title = calculate_dot_product(item['title'], title_embeddings)
    dot_product_summary = calculate_dot_product(item['summary'], summary_embeddings)
    
    
    item['content_relevance'] = dot_product_content
    item['title_relevance'] = dot_product_title
    item['summary_relevance'] = dot_product_summary

    print(f'\nAverage dot product for {item["title"]}:')
    print(f'Content: {np.average(dot_product_content)}')
    print(f'Title: {np.average(dot_product_title)}')
    print(f'Summary: {np.average(dot_product_summary)}')
    print('\n======================\n')

    context['items'].append(item)
  
    save_context(context)
  
  return new_content


def save_context(context):
  with open(SETTINGS.dot_products_file, 'w') as f:

    json.dump(context, f, indent=2)