import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { getEnvVariable, getRegion } from "@last-week/helpers";
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

const lambda = new LambdaClient({ region: getRegion() });

export const handler = async (): Promise<APIGatewayProxyResult> => {
  await lambda.send(
    new InvokeCommand({
      FunctionName: getEnvVariable("DELETE_DATA_SOURCES_FUNCTION_NAME"),
    })
  );

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
        source: "NEW",
        title,
        link,
        content,
        summary,
        embedding,
      },
      {
        returnValues: "ALL_NEW",
      }
    );
  });

  await Promise.all(dataSourceItems);

  // Invoke the lambda function
  await lambda.send(
    new InvokeCommand({
      FunctionName: getEnvVariable("GENERATE_COMMENTARY_FUNCTION_NAME"),
    })
  );

  return {
    statusCode: 200,
    body: "Data sources generated successfully!",
  };
};

const getContent = async (url: string) => {
  const dataSourceContent = await fetch(url).then((res) => res.text());

  const root = parse(dataSourceContent);

  const paragraphs = root.querySelectorAll("p");

  const text = paragraphs.map((p) => p.text).join("\n");

  return text;
};
