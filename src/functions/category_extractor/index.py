import json
import os

from functions.category_extractor.llm import LLM

def get_categories(llm, email):
  ''' Function to extract the categories from the email

  Args:
    email: The email to extract the categories from

  Returns:
    categories: The categories extracted from the email
  '''
  
  return llm.parse_text(email)



def category_extractor(input_dir):
  ''' Main function to extract the categories from the email
  '''
  llm = LLM()
  delete_categories()

  for files in os.listdir(input_dir):

    with open(os.path.join(input_dir, files), 'r') as f:
      email = f.read()
      categories = get_categories(llm, email)

    update_categories(categories)


def delete_categories():
  """ Function to delete the categories.json file
  
  """
  if os.path.exists('data/categories.json'):
    os.remove('data/categories.json')



def update_categories(categories):
  """ File that updates the categories.json file with the new categories
  
  File is saved as JSON file with category names and total number of occurrences
  {
    "category1": 1,
    "category2": 2,
    "category3": 2,
  }
  """
  if os.path.exists('data/categories.json'):
    with open('data/categories.json', 'r') as f:
      data = json.load(f)
  else:
    data = {}

  for category in categories:
    if category in data:
      data[category] += 1
    else:
      data[category] = 1

  data = dict(sorted(data.items(), key=lambda item: item[1], reverse=True))

  with open('data/categories.json', 'w') as f:
    json.dump(data, f, indent=2)

