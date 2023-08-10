#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsCdkSechubSsmStack } from '../lib/stack/aws-cdk-sechub-ssm-stack';

const app = new cdk.App();
new AwsCdkSechubSsmStack(app, 'AwsCdkSechubSsmStack', {});
