import { APIGatewayProxyResult } from "aws-lambda";
import parse from "node-html-parser";
import { DataSourceEntity } from "../../dataModel";
import {
  dateFilter,
  fetchDataSourceLinks,
  getEmbedding,
  heuristicsFilter,
} from "../utils";
import { invoke } from "./invoke";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const dataSources = await fetchDataSourceLinks();

  const filteredDataSourcesTime = dateFilter(dataSources);

  const filteredDataSourcesHeuristics = heuristicsFilter(
    filteredDataSourcesTime
  );

  const { items } = filteredDataSourcesHeuristics;

  const dataSourceItems = items.map(async (item) => {
    const { title, link } = item;

    const content = await getContent(link);

    if (!content) {
      console.log("No content found for", title);
      return;
    }

    const summary = await invoke(content);

    const embedding = await getEmbedding(summary);

    DataSourceEntity.update(
      {
        source: "AWS_RSS_FEED",
        title,
        link,
        summary,
        embedding,
      },
      {
        returnValues: "ALL_NEW",
      }
    );
  });

  const embeddingData = await Promise.all(dataSourceItems);

  return {
    statusCode: 200,
    body: JSON.stringify({ embeddingData }),
  };
};

const getContent = async (url: string) => {
  const dataSourceContent = await fetch(url).then((res) => res.text());

  const root = parse(dataSourceContent);

  const paragraphs = root.querySelectorAll("p");

  const text = paragraphs.map((p) => p.text).join("\n");

  return text;
};
