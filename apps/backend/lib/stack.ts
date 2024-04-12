import { buildResourceName } from "@last-week/helpers";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { DynamoDBConstruct } from "@last-week/cdk-constructs";

import { PreloadBenchmark, GenerateSummaries, DeleteDataSources } from "./resources/functions";

export class LastWeekStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const dataSourcesTable = new DynamoDBConstruct(this, "dataSources", {
      tableName: buildResourceName("data-sources"),
    });

    new PreloadBenchmark(this, "preloadBenchmark", {
      table: dataSourcesTable.table,
    });

    new GenerateSummaries(this, "generateDataSources", {
      table: dataSourcesTable.table,
    });

    new DeleteDataSources(this, "deleteDataSources", {
      table: dataSourcesTable.table,
    });
  }
}
