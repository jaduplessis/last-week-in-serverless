import { APIGatewayProxyResult } from "aws-lambda";
import { DataSourceEntity } from "../../dataModel";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  // Fetch all data sources
  const benchmarkDataSources = await DataSourceEntity.query(
    "DATA_SOURCE#BENCHMARK"
  );
  const newDataSource = await DataSourceEntity.query("DATA_SOURCE#NEW");

  if (!newDataSource.Items || !benchmarkDataSources.Items) {
    return {
      statusCode: 200,
      body: `Missing data sources. Benchmark: ${benchmarkDataSources.Items}, New: ${newDataSource.Items}`,
    };
  }

  // Retrieve benchmark embedding
  const benchmarkEmbeddings = benchmarkDataSources.Items.map(
    (dataSource) => dataSource.embedding
  );

  // Loop through new data source embeddings
  const dotProductData = newDataSource.Items.map((dataSource) => {
    const newEmbedding = dataSource.embedding;

    // Calculate dot product against all benchmark embeddings. Store the top 10
    let maxDotProduct = 0;
    benchmarkEmbeddings.map((benchmarkEmbedding) => {
      const dotProduct = newEmbedding.reduce(
        (acc, val, idx) => acc + val * benchmarkEmbedding[idx],
        0
      );
      if (dotProduct > maxDotProduct) {
        maxDotProduct = dotProduct;
      }
    });

    return {
      ...dataSource,
      maxDotProduct,
    };
  });

  // Order by dot product
  dotProductData.sort((a, b) => b.maxDotProduct - a.maxDotProduct);
  
  console.log(dotProductData);


  // Calculate dot product against all benchmark embeddings. Store the top 10
  // Return the top 10 data sources
  const topDataSources = dotProductData.slice(0, 10);

  return {
    statusCode: 200,
    body: JSON.stringify({ topDataSources }),
  };
};
