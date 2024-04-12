import { IDataSource } from "../../dataModel";

interface IDataSourceWithDotProduct extends IDataSource {
  maxDotProduct: number;
  top3DotProduct: number;
  ranking: number;
}

export const rankDataRelevance = async (
  newDataSourceItems: IDataSource[],
  benchmarkEmbeddings: number[][],
  numResults: number
): Promise<IDataSourceWithDotProduct[]> => {
  // Loop through new data source embeddings
  const dotProductData = newDataSourceItems.map((dataSource) => {
    const newEmbedding = dataSource.embedding;

    // Calculate dot product against all benchmark embeddings. Store the top 10
    const dotProducts: number[] = [];
    benchmarkEmbeddings.map((benchmarkEmbedding) => {
      const dotProduct = newEmbedding.reduce(
        (acc, val, idx) => acc + val * benchmarkEmbedding[idx],
        0
      );

      dotProducts.push(dotProduct);
    });

    // Sort dot products
    dotProducts.sort((a, b) => b - a);
    const maxDotProduct = dotProducts[0];
    const top3DotProduct =
      dotProducts.slice(0, 3).reduce((a, b) => a + b, 0) / 3;

    return {
      ...dataSource,
      maxDotProduct,
      top3DotProduct,
    };
  });

  // Order by dot product
  dotProductData.sort((a, b) => b.maxDotProduct - a.maxDotProduct);

  // Assign ranking
  const rankedData = dotProductData.map((dataSource, idx) => ({
    ...dataSource,
    ranking: idx + 1,
  }));

  return rankedData.slice(0, numResults);
};
