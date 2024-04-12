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

interface slackIntegrationProps {
  table: Table;
}

export class SlackIntegration extends Construct {
  public function: NodejsFunction;

  constructor(scope: Construct, id: string, { table }: slackIntegrationProps) {
    super(scope, id);

    const SLACK_SIGNING_SECRET = getEnvVariable("SLACK_SIGNING_SECRET");
    const SLACK_BOT_TOKEN = getEnvVariable("SLACK_BOT_TOKEN");

    this.function = new LastWeekCustomResource(
      this,
      buildResourceName("slackIntegration"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
        environment: {
          SLACK_SIGNING_SECRET,
          SLACK_BOT_TOKEN,
        },
      }
    );

    table.grantReadData(this.function);
  }
}
