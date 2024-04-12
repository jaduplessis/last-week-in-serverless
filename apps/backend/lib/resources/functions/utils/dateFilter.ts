import { DataSources } from ".";

export const dateFilter = (dataSources: DataSources): DataSources => {
  // Get the current date
  const currentDate = new Date();

  // Get 7 days ago
  const durationDate = new Date(currentDate);
  durationDate.setDate(durationDate.getDate() - 7);

  // Filter the data
  const filteredData: DataSources = {
    items: [],
  };

  for (const item of dataSources.items) {
    const itemPubDate = new Date(item.pubDate);

    if (itemPubDate > durationDate) {
      filteredData.items.push(item);
    }
  }

  return filteredData;
};
