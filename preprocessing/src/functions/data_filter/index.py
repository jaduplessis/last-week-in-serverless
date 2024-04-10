import json

from constants import SETTINGS
from functions.data_filter.date import date_filter
from functions.data_filter.content import retrieve_content
from functions.data_filter.heuristics import heuristics_filter

def filter():
  
    with open(SETTINGS.whats_new_output, "r") as f:
        data = json.load(f)

    duration = SETTINGS.data_retention_duration

    data = date_filter(data, duration)

    data = retrieve_content(data)

    data = heuristics_filter(data)

    return data

    
    













