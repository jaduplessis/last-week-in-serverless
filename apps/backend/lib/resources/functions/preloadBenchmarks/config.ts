import { buildResourceName, getCdkHandlerPath, getEnvVariable } from "@last-week/helpers";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { LastWeekCustomResource } from "@last-week/cdk-constructs";
import { CustomResource, Duration } from "aws-cdk-lib";
import { Provider } from "aws-cdk-lib/custom-resources";

interface PreloadBenchmarkProps {
  table: Table;
}

export class PreloadBenchmark extends Construct {
  public function: NodejsFunction;
  public customResourceProvider: Provider;

  constructor(scope: Construct, id: string, { table }: PreloadBenchmarkProps) {
    super(scope, id);

    this.function = new LastWeekCustomResource(
      this,
      buildResourceName("preloadBenchmark"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.minutes(5),
        environment: {
          "OPENAI_API_KEY": getEnvVariable("OPENAI_API_KEY"),
        },
      }
    );

    table.grantReadWriteData(this.function);

    this.customResourceProvider = new Provider(this, "preloadDataProvider", {
      onEventHandler: this.function,
    });

    new CustomResource(this, "customResourceResult", {
      serviceToken: this.customResourceProvider.serviceToken,
    });
  }
}
