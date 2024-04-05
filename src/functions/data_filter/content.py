
import json
from functions.utils.soup import soupify
from functions.data_filter.llm import LLM
from constants import SETTINGS


def retrieve_categories(data):
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
    #       category: "Category",
    #       content: "Content"
    #     },
    #     ...
    #   ]
    # }
    """
    llm = LLM()

    for item in data["items"]:
        print(f"Processing {item['title']}. Item {data['items'].index(item) + 1} of {len(data['items'])}")

        link = item["link"]
        soup = soupify(link)

        content = soup.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6"])
        string_content = ""
        for tag in content:
            string_content += tag.text
            string_content += "\n"
  
        category = llm.parse_text(string_content)

        item["category"] = category
        item["content"] = string_content

        save_data(data)

    return data


def save_data(data):
    """ Function to save the data to a file

    Args:
        data (dict): The data to save
    """

    with open(SETTINGS.whats_new_output, "w") as f:
        json.dump(data, f, indent=2)