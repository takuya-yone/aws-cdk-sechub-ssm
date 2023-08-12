/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_logs as logs } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import { aws_iam as iam } from 'aws-cdk-lib';
import { ScopedAws } from 'aws-cdk-lib';

import * as path from 'path';

export class LambdaConstruct extends Construct {
  public sechubSsmFunctin: node_lambda.NodejsFunction;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const { accountId } = new ScopedAws(this);

    const sechubSsmFunctinRole = new iam.Role(this, 'SechubSsmFunctinRole', {
      roleName: 'SechubSsmFunctinRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaSQSQueueExecutionRole',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AWSIncidentManagerResolverAccess',
        ),
      ],
    });

    this.sechubSsmFunctin = new node_lambda.NodejsFunction(
      this,
      'SechubSsmFunctin',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, '../../src/lambda/index.ts'),
        handler: 'handler',
        // memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        tracing: lambda.Tracing.ACTIVE,
        retryAttempts: 0,
        logRetention: logs.RetentionDays.THREE_DAYS,
        role: sechubSsmFunctinRole,

        // insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_229_0,
        environment: {
          RESPONSE_PLAN_ARN: `arn:aws:ssm-incidents::${accountId}:response-plan/test-t-yonezawa-plan`,
        },
      },
    );
  }
}
