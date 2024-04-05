from constants import SETTINGS
from functions.whats_new_fetcher.soup import soupify


def fetcher_li_items():
  """ Function to fetch the li items from the AWS What's New page for class type 

  
  """
  whats_new_rss_feed = SETTINGS.whats_new_rss_feed

  soup = soupify(whats_new_rss_feed, 'xml')
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

  data = {
    "items": [],
  }

  items = soup.find_all("item")
  for item in items:
      
    item_title = item.find("title").text
    item_link = item.find("link").text
    item_pubDate = item.find("pubDate").text
    
    item_data = {
        "title": item_title,
        "link": item_link,
        "pubDate": item_pubDate,
    }

    data["items"].append(item_data)

  return data

