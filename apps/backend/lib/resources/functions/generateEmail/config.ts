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

interface GenerateEmailProps {
  table: Table;
}

export class GenerateEmail extends Construct {
  public function: NodejsFunction;
  public customResourceProvider: Provider;

  constructor(
    scope: Construct,
    id: string,
    { table }: GenerateEmailProps
  ) {
    super(scope, id);

    this.function = new LastWeekCustomResource(
      this,
      buildResourceName("generateEmail"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.minutes(5),
        environment: {
          ANTHROPIC_API_KEY: getEnvVariable("ANTHROPIC_API_KEY"),
        },
      }
    );

    table.grantReadWriteData(this.function);
  }
}
