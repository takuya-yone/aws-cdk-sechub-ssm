/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaConstruct } from '../construct/lambda';
import { EventBridgeConstruct } from '../construct/eventbridge';

export class AwsCdkSechubSsmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaConstruct = new LambdaConstruct(this, 'LambdaConstruct');
    const eventBridgeConstructc = new EventBridgeConstruct(
      this,
      'EventBridgeConstruct',
      {
        sechubSsmFunctin: lambdaConstruct.sechubSsmFunctin,
      },
    );
  }
}
