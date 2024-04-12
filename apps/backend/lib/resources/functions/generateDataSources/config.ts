import {
  buildResourceName,
  getCdkHandlerPath,
  getEnvVariable,
} from "@last-week/helpers";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { LastWeekCustomResource } from "@last-week/cdk-constructs";
import { Duration } from "aws-cdk-lib";
import { Provider } from "aws-cdk-lib/custom-resources";

interface GenerateDataSourcesProps {
  table: Table;
  commentaryFunction: NodejsFunction;
}

export class GenerateDataSources extends Construct {
  public function: NodejsFunction;
  public customResourceProvider: Provider;

  constructor(
    scope: Construct,
    id: string,
    { table, commentaryFunction }: GenerateDataSourcesProps
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
          GENERATE_COMMENTARY_FUNCTION_NAME: commentaryFunction.functionName,
        },
      }
    );

    table.grantReadWriteData(this.function);
    commentaryFunction.grantInvoke(this.function);
  }
}
