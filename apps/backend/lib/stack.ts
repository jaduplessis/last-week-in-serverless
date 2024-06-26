import { buildResourceName, getStage } from "@last-week/helpers";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ApiGateway, DynamoDBConstruct } from "@last-week/cdk-constructs";

import {
  DeleteDataSources,
  GenerateCommentary,
  GenerateDataSources,
  PreloadBenchmark,
  SlackIntegration,
} from "./resources/functions";

export class LastWeekStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getStage();

    const dataSourcesTable = new DynamoDBConstruct(this, "dataSources", {
      tableName: buildResourceName("data-sources"),
    });

    new PreloadBenchmark(this, "preloadBenchmark", {
      table: dataSourcesTable.table,
    });

    const generateCommentary = new GenerateCommentary(
      this,
      "generateCommentary",
      {
        table: dataSourcesTable.table,
      }
    );
    
    const deleteDataSources = new DeleteDataSources(this, "deleteDataSources", {
      table: dataSourcesTable.table,
    });

    new GenerateDataSources(this, "generateDataSources", {
      table: dataSourcesTable.table,
      deleteDataSourcesFunction: deleteDataSources.function,
      commentaryFunction: generateCommentary.function,
    });


    const slackIntegration = new SlackIntegration(this, "slackIntegration", {
      table: dataSourcesTable.table,
    });

    new ApiGateway(this, "api-gateway", {
      stage,
      slackIntegration,
    });

    new CfnOutput(this, "stage", {
      value: stage,
    });
  }
}
