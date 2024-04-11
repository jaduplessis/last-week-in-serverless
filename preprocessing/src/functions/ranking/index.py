import json
import os

from constants import SETTINGS


def rank_data_relevance():
    ''' Function to rank the data relevance from the dot product results

    Approach is to take the maximum dot product value from the summary comparison
    '''
    


def save_data(data, file):
    """ Function to save the data to a file

    Args:
        data (dict): The data to save
    """
    file_path = os.path.join(SETTINGS.ranks_output_dir, file)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)