import { APIGatewayProxyResult } from "aws-lambda";
import { DataSourceEntity } from "../../dataModel";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const dataSources = await DataSourceEntity.query("DATA_SOURCE#NEW");

  if (!dataSources.Items) {
    return {
      statusCode: 200,
      body: "No data sources found.",
    };
  }

  // Delete all data sources with SK "NEW_DATA_SOURCE"
  await Promise.all(
    dataSources.Items.map(async (dataSource) => {
      await DataSourceEntity.delete(dataSource);
    })
  );

  return {
    statusCode: 200,
    body: "Data sources deleted successfully.",
  };
};
