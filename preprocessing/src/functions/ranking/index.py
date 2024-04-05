import json

from constants import SETTINGS


def rank_data_relevancy():
    ''' Function to rank the data relevancy compared to previous data

    Scoring system is a value out of 100 with 100 being the most relevant.

    Scoring is categories[<category>] / max(categories.values()) * 100

    Returns:
      ranked_data: The ranked data
    '''
    with open(SETTINGS.categories_file, 'r') as f:
        categories = json.load(f)
        keys = list(categories.keys())

    with open(SETTINGS.whats_new_output, 'r') as f:
        whats_new = json.load(f)
    
    for item in whats_new["items"]:
        if item["category"] not in keys:
            item["relevance"] = 0
            continue
        
        category = item["category"]
        item["relevance"] = categories[category] / max(categories.values()) * 100


    # Order the data by relevance
    whats_new["items"] = sorted(whats_new["items"], key=lambda x: x["relevance"], reverse=True)

    save_data(whats_new)
    
    return whats_new




def save_data(data):
    """ Function to save the data to a file

    Args:
        data (dict): The data to save
    """

    with open(SETTINGS.whats_new_output, "w") as f:
        json.dump(data, f, indent=2)