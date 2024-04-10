import json
import os
import re

from constants import SETTINGS
from functions.embeddings.embed import generate_embedding
from functions.summary.index import generate_summary
from functions.utils.soup import soupify


def fetch_external_links():
    ''' Main function to extract the embeddings from the email
    '''
    input_dir = SETTINGS.txt_dir
    all_links = []
    for files in os.listdir(input_dir):
        with open(os.path.join(input_dir, files), 'r') as f:
            email = f.read()

        # Extract the links
        # Regex = link("https://aws.amazon.com/**")
        links = re.findall(r'link\("https://aws.amazon.com/.*?"\)', email)
        links = [link.replace('link("', '').replace('")', '') for link in links]
        all_links += links

    with open(SETTINGS.links_file, 'w') as f:
        data = {
            "links": all_links
        }
        json.dump(data, f, indent=2)


    return all_links


def fetch_content(link):
    soup = soupify(link)

    content = soup.find_all(["p"])
    string_content = ""
    for tag in content:
        string_content += tag.text
        string_content += "\n"

    summary = generate_summary(string_content)
    print(summary)

    title = soup.find("h1")
    return string_content, summary, title.text


def generate_documents():
    all_links = fetch_external_links()
    all_content = []

    data = { "items": [] }

    for index, link in enumerate(all_links):
        print(f"Processing {index}/{len(all_links)}")
        content, summary, title = fetch_content(link)
        all_content.append(content)

        data["items"].append({
            "link": link,
            "title": title,
            "summary": summary,
            "content": content,
        })
        with open(SETTINGS.rss_feed_file, 'w') as f:

            json.dump(data, f, indent=2)


