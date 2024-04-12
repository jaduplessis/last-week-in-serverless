import { getStage, sharedLambdaEsbuildConfig } from "@last-week/helpers";
import { Duration } from "aws-cdk-lib";
import { Role } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export interface LastWeekLambdaProps {
  lambdaEntry: string;
  environment?: Record<string, string>;
  timeout?: Duration;
  role?: Role;
  memorySize?: number;
  runtime?: Runtime;
}

export class LastWeekCustomResource extends NodejsFunction {
  constructor(scope: Construct, id: string, props: LastWeekLambdaProps) {
    const { lambdaEntry, environment, memorySize, role, timeout } = props;

    const functionName = `${id}-lambda`;

    super(scope, `${id}-lambda`, {
      functionName,
      runtime: Runtime.NODEJS_18_X,
      bundling: {
        ...sharedLambdaEsbuildConfig,
        metafile: true,
        externalModules: [],
      },
      awsSdkConnectionReuse: true,
      entry: lambdaEntry,
      memorySize: memorySize ?? 1024,
      environment: {
        ...environment,
        STAGE: getStage(),
      },
      role,
      timeout: timeout ?? Duration.seconds(30),
    });
  }
}
