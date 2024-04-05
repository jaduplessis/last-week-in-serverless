import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.getcwd(), '..')))

from functions.rtf_decoder.index import rtf_decoder
from functions.category_extractor.index import category_extractor

if __name__ == '__main__':
  # rtf_decoder('data/prompt/rtf', 'data/prompt/txt')

  categories = category_extractor('data/prompt/txt')


