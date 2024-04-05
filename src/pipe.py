import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.getcwd(), '..')))

from constants import SETTINGS
from functions.category_extractor.index import category_extractor
from functions.data_filter.index import filter
from functions.ranking.index import rank_data_relevancy
from functions.rtf_decoder.index import rtf_decoder
from functions.utils.soup import soupify
from functions.whats_new_fetcher.index import fetcher_li_items

if __name__ == '__main__':
  # rtf_decoder(SETTINGS.rtf_dir, SETTINGS.txt_dir)
  # categories = category_extractor(SETTINGS.txt_dir)

  # fetcher_li_items()

  # filter()

  rank_data_relevancy()

  print("Done!")

    



