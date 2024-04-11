import { DOMParser } from "@xmldom/xmldom";

export interface DataSourceItem {
  title: string;
  link: string;
  pubDate: string;
}

interface Data {
  items: DataSourceItem[];
}

export const fetchDataSourceLinks = async (): Promise<Data> => {
  const whatsNewRssFeed =
    "https://aws.amazon.com/about-aws/whats-new/recent/feed/";

  const whatsNewRssFeedResponse = await fetch(whatsNewRssFeed).then((res) =>
    res.text()
  );

  const parser = new DOMParser();
  const doc = parser.parseFromString(whatsNewRssFeedResponse, "application/xml");
  console.log(doc);

  const data: Data = {
    items: [],
  };

  const items = doc.getElementsByTagName("item");
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemTitle = item.getElementsByTagName("title")[0].textContent || "";
    const itemLink = item.getElementsByTagName("link")[0].textContent || "";
    const itemPubDate =
      item.getElementsByTagName("pubDate")[0].textContent || "";

    data.items.push({
      title: itemTitle,
      link: itemLink,
      pubDate: itemPubDate,
    });
  }

  return data;
};
