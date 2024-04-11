

import json
from constants import SETTINGS
from functions.summary.llm import LLM


def generate_summary(content):
  llm = LLM()
    
  return llm.parse_text(content)



def generate_summaries(input_file):
  with open(input_file, 'r') as f:
    data = json.load(f)

  for item in data['items']:
    print(f'Generating summary for: {item["title"]}. Item {data["items"].index(item)}/{len(data["items"])}')
    content = item['content']
    summary = generate_summary(content)
    item['summary'] = summary

    with open(input_file, 'w') as f:
      json.dump(data, f, indent=2)