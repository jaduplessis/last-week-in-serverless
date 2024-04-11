import { APIGatewayProxyResult } from "aws-lambda";
import { fetchDataSourceLinks } from "../utils";
import { filterDataSourcesTime } from "../utils/filterDataSourcesTime";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const dataSources = await fetchDataSourceLinks();

  const filteredDataSourcesTime = await filterDataSourcesTime(dataSources);



  // const summaries = await generateSummaries(filteredLinks);
  return {
    statusCode: 200,
    body: JSON.stringify({ filteredDataSourcesTime }),
  };
};
