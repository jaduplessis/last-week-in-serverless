import { DataSources } from ".";

export const heuristicsFilter = (data: DataSources): DataSources => {
  
  const filteredData: DataSources = {
    items: [],
  };

  for (const item of data.items) {
    const title = item.title.toLowerCase();

    // Heuristic 1
    if (
      title.includes("ec2") &&
      !["serverless", "lambda"].some((word) => title.includes(word))
    ) {
      continue;
    }

    // Heuristic 2
    if (
      title.includes("is now available in") &&
      !["london", "ireland", "paris", "frankfurt", "milan"].some((word) =>
        title.includes(word)
      )
    ) {
      continue;
    }

    filteredData.items.push(item);
  }

  return filteredData;
}

