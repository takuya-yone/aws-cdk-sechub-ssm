import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaConstruct } from '../construct/lambda';

export class AwsCdkSechubSsmStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaConstruct(this, 'LambdaConstruct');
  }
}
