import { APIGatewayProxyResult } from "aws-lambda";
import { DataSourceEntity } from "../../dataModel";
import { invoke } from "./invoke";
import { rankDataRelevance } from "./relevanceRanking";

interface ResponseItems {
  title: string;
  link: string;
  commentary: string;
}

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const benchmarkDataSources = await DataSourceEntity.query(
    "DATA_SOURCE#BENCHMARK"
  );
  const newDataSource = await DataSourceEntity.query("DATA_SOURCE#NEW");

  if (!newDataSource.Items || !benchmarkDataSources.Items) {
    throw new Error(
      `Missing data sources. Benchmark: ${benchmarkDataSources.Items}, New: ${newDataSource.Items}`
    );
  }

  // Retrieve benchmark embedding
  const benchmarkEmbeddings = benchmarkDataSources.Items.map(
    (dataSource) => dataSource.embedding
  );

  const relevantDataSources = await rankDataRelevance(
    newDataSource.Items,
    benchmarkEmbeddings,
    10
  );

  const responseItems: ResponseItems[] = [];

  const relevantDataSourceItems = relevantDataSources.map(async (item) => {
    const { content, title, link } = item;

    if (!content) {
      console.log("No content found for", title);
      return;
    }

    const commentary = await invoke(content);

    responseItems.push({ title, link, commentary });

    await DataSourceEntity.update({
      source: "COMMENTARY",
      title,
      link,
      commentary,
    });
  });

  await Promise.all(relevantDataSourceItems);

  return {
    statusCode: 200,
    body: JSON.stringify({ responseItems }),
  };
};
