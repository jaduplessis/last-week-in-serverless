import { LambdaInvoke } from "@aws-cdk/aws-scheduler-targets-alpha";
import {
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
} from "@last-week/helpers";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { Schedule, ScheduleExpression } from "@aws-cdk/aws-scheduler-alpha";
import { LastWeekCustomResource } from "@last-week/cdk-constructs";
import { Duration } from "aws-cdk-lib";

interface GenerateDataSourcesProps {
  table: Table;
  deleteDataSourcesFunction: NodejsFunction;
  commentaryFunction: NodejsFunction;
}

export class GenerateDataSources extends Construct {
  public function: NodejsFunction;
  public schedule: Schedule;

  constructor(
    scope: Construct,
    id: string,
    {
      table,
      commentaryFunction,
      deleteDataSourcesFunction,
    }: GenerateDataSourcesProps
  ) {
    super(scope, id);

    this.function = new LastWeekCustomResource(
      this,
      buildResourceName("generateDataSources"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.minutes(5),
        environment: {
          OPENAI_API_KEY: getEnvVariable("OPENAI_API_KEY"),
          ANTHROPIC_API_KEY: getEnvVariable("ANTHROPIC_API_KEY"),
          DELETE_DATA_SOURCES_FUNCTION_NAME:
            deleteDataSourcesFunction.functionName,
          GENERATE_COMMENTARY_FUNCTION_NAME: commentaryFunction.functionName,
        },
      }
    );

    table.grantReadWriteData(this.function);
    commentaryFunction.grantInvoke(this.function);
    deleteDataSourcesFunction.grantInvoke(this.function);

    const target = new LambdaInvoke(this.function, {});

    this.schedule = new Schedule(this, "schedule", {
      schedule: ScheduleExpression.cron({
        minute: "0",
        hour: "1",
        weekDay: "FRI",
      }),
      target,
    });
  }
}
