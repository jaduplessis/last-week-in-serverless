import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.getcwd(), '..')))

from constants import SETTINGS
from functions.benchmark.index import generate_benchmark_data
from functions.category_extractor.index import category_extractor
from functions.data_filter.index import filter_rss_data
from functions.context.index import generate_context_file
from functions.rtf_decoder.index import rtf_decoder
from functions.summary.index import generate_summaries
from functions.utils.soup import soupify
from functions.whats_new_fetcher.index import fetch_rss_whats_new_feed

if __name__ == '__main__':
  # * Format email
  # rtf_decoder(SETTINGS.rtf_dir, SETTINGS.txt_dir)

  # * Fetch the links from the emails. Benchmark data
  # generate_benchmark_data()

  # * Fetch the latest AWS news. New data
  fetch_rss_whats_new_feed()
  filter_rss_data()
  generate_summaries(SETTINGS.whats_new_file)


  generate_context_file()

  print("Done!")

    



