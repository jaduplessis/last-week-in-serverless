from datetime import datetime, timedelta


def date_filter(data, duration):
    """
    Filter data by data by duration from current date. Return data minus the excluded results
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

    # Get the current date
    current_date = datetime.now()

    # Get the date of the duration
    duration_date = current_date - timedelta(days=duration)

    # Filter the data
    filtered_data = {
        "items": [],
    }

    for item in data["items"]:
        item_pubDate = item["pubDate"]
        item_pubDate = datetime.strptime(item_pubDate, "%a, %d %b %Y %H:%M:%S %z")
        item_pubDate = item_pubDate.replace(tzinfo=None)

        if item_pubDate > duration_date:
            filtered_data["items"].append(item)

    return filtered_data
    