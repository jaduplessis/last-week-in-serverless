import json

from constants import SETTINGS
from functions.data_filter.content import retrieve_content
from functions.data_filter.date import date_filter
from functions.data_filter.heuristics import heuristics_filter


def filter_rss_data():
  
    with open(SETTINGS.whats_new_file, "r") as f:
        data = json.load(f)

    duration = SETTINGS.data_retention_duration

    data = date_filter(data, duration)

    data = retrieve_content(data)

    data = heuristics_filter(data)

    save_data(data)

    return data

    
def save_data(data):
    """ Function to save the data to a file

    Args:
        data (dict): The data to save
    """

    with open(SETTINGS.whats_new_file, "w") as f:
        json.dump(data, f, indent=2)
    













