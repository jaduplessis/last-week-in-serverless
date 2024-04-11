
import { APIGatewayProxyResult } from "aws-lambda";
import { fetchDataSourceLinks } from "../utils";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const links = await fetchDataSourceLinks();

  console.log({ links });

  // const filteredLinks = await filterLinks(links);

  // const summaries = await generateSummaries(filteredLinks);
  return {
    statusCode: 200,
    body: JSON.stringify({ links }),
  };
};
