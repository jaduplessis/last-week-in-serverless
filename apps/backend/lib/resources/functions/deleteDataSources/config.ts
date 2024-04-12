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

interface DeleteDataSourcesProps {
  table: Table;
}

export class DeleteDataSources extends Construct {
  public function: NodejsFunction;
  public customResourceProvider: Provider;

  constructor(
    scope: Construct,
    id: string,
    { table }: DeleteDataSourcesProps
  ) {
    super(scope, id);

    this.function = new LastWeekCustomResource(
      this,
      buildResourceName("deleteDataSources"),
      {
        lambdaEntry: getCdkHandlerPath(__dirname),
        timeout: Duration.seconds(30),
      }
    );

    table.grantReadWriteData(this.function);
  }
}
