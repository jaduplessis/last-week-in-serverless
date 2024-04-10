
from bs4 import BeautifulSoup
import requests


def soupify(url, parser='html.parser'):
  """ Function to get the HTML content of a webpage and parse it using BeautifulSoup.
  """
  
  response = requests.get(url)
  content = response.content
  soup = BeautifulSoup(content, parser)

  return soup


