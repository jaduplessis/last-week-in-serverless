import {
  CdkCustomResourceEvent,
  CdkCustomResourceResponse,
  Context,
} from "aws-lambda";

import { BenchmarkEntity } from "../../dataModel";

import { getEmbedding } from "../utils";
import { data } from "./benchmark_data";

export const handler = async (
  event: CdkCustomResourceEvent,
  context: Context
): Promise<CdkCustomResourceResponse> => {
  const response: CdkCustomResourceResponse = {
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    PhysicalResourceId: context.logGroupName,
  };

  if (event.RequestType !== "Create") {
    response.Status = "SUCCESS";
    response.Data = { Result: "None" };

    return response;
  }

  try {
    const { items } = data;

    const benchmarkItems = items.map(async (item) => {
      const { id, title, link, summary } = item;

      console.log({ title, link, summary });

      const embedding = await getEmbedding(title);
      console.log({ embedding });

      return BenchmarkEntity.update({
        id,
        title,
        link,
        summary,
        embedding
      });
    });

    await Promise.all(benchmarkItems);

    response.Status = "SUCCESS";
    response.Data = { Result: "Updated Successfully" };

    return response;
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      response.Reason = error.message;
    }
    response.Status = "FAILED";
    response.Data = { Result: error };

    return response;
  }
};