import { APIGatewayProxyResult } from "aws-lambda";
import { DataSourceEntity } from "../../dataModel";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const newDataSources = await DataSourceEntity.query("DATA_SOURCE#NEW");
  const commentaryDataSources = await DataSourceEntity.query(
    "DATA_SOURCE#COMMENTARY"
  );

  if (!newDataSources.Items || !commentaryDataSources.Items) {
    return {
      statusCode: 200,
      body: "No data sources found.",
    };
  }

  await Promise.all(
    newDataSources.Items.map(async (dataSource) => {
      await DataSourceEntity.delete(dataSource);
    })
  );

  await Promise.all(
    commentaryDataSources.Items.map(async (dataSource) => {
      await DataSourceEntity.delete(dataSource);
    })
  );

  return {
    statusCode: 200,
    body: "Data sources deleted successfully.",
  };
};
