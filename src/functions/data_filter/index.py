import json

from constants import SETTINGS
from functions.data_filter.date import date_filter
from functions.data_filter.content import retrieve_categories

def filter():
  
    with open(SETTINGS.whats_new_output, "r") as f:
        data = json.load(f)

    duration = SETTINGS.data_retention_duration

    date_filtered_data = date_filter(data, duration)

    categorical_data = retrieve_categories(date_filtered_data)

    return categorical_data
    













