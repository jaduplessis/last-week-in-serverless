
import json
from functions.utils.soup import soupify
from constants import SETTINGS


def retrieve_content(data):
    """ Function to loop through the data sources and determine the category of the content

    For each item in the list, the function will web scrape the link and provide the content to a content parser function.
    The content parser function will return the category of the content and the data object will be updated with the category.
    # Data structure:
    # {
    #   items: [
    #     {
    #       title: "Title",
    #       link: "Link",
    #       pubDate: "Date",
    #       content: "Content"
    #     },
    #     ...
    #   ]
    # }
    """

    for item in data["items"]:
        print(f"Processing {item['title']}. Item {data['items'].index(item) + 1} of {len(data['items'])}")

        link = item["link"]
        soup = soupify(link)

        content = soup.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6"])
        string_content = ""
        for tag in content:
            string_content += tag.text
            string_content += "\n"
  
        item["content"] = string_content


    return data


