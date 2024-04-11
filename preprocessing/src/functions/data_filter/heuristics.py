import json
from datetime import datetime, timedelta

from constants import SETTINGS


def heuristics_filter(data):
    """
    Filter data by heuristics. Return data minus the excluded results

    heuristic 1: title contains the word 'EC2' but not any of ['serverless','lambda']
    heuristic 2: title contains the phrase 'is now available in' but not any of: [
      "london", "ireland", "paris", "frankfurt", "milan"
    ]

    Data provided with this structure:
    # Data structure:
    # {
    #   items: [
    #     {
    #       title: "Title",
    #       link: "Link",
    #       pubDate: "Date",
    #     },
    #     ...
    #   ]
    # }
    """
    filtered_data = {
        "items": [],
    }

    for item in data["items"]:
        title = item["title"].lower()


        # Heuristic 1
        if "ec2" in title and not any(word in title for word in ["serverless", "lambda"]):
            continue
        
        # Heuristic 2
        if "is now available in" in title and not any(word in title for word in ["london", "ireland", "paris", "frankfurt", "milan"]):
            continue
        
        filtered_data["items"].append(item)

    

    return filtered_data


