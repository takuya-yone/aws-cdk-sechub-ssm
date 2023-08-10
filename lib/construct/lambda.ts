/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';

import * as path from 'path';

export class LambdaConstruct extends Construct {
  public sechubSsmFunctin: node_lambda.NodejsFunction;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.sechubSsmFunctin = new node_lambda.NodejsFunction(
      this,
      'sechubSsmFunctin',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../src/lambda/index.ts'),
        handler: 'handler',
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_229_0,
        // environment: {
        //   // DDB_TABLE: props.tableName,
        // },
      },
    );
  }
}
