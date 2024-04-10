import json
import os

from constants import SETTINGS


def rank_data_relevance():
    ''' Function to rank the data relevance from the dot product results

    Multiple approaches to take, each one applied to a different field (title, content, summary)
    1. Average the dot product results
    2. Take the single highest dot product result
    3. Take the five highest dot product results
    

    '''
    


def save_data(data, file):
    """ Function to save the data to a file

    Args:
        data (dict): The data to save
    """
    file_path = os.path.join(SETTINGS.ranks_output_dir, file)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)