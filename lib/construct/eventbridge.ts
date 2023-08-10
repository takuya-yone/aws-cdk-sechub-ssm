/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
// import  * as events  from 'aws-cdk-lib/aws-events';
import { aws_events as events } from 'aws-cdk-lib';
import { aws_events_targets as targets } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_sns_subscriptions as sns_subscription } from 'aws-cdk-lib';
import { aws_lambda_event_sources as lambda_event_sources } from 'aws-cdk-lib';
// import {SqsSubscription} from "@aws-cdk/aws-sns-subscriptions";

import { aws_logs as logs } from 'aws-cdk-lib';
import * as path from 'path';

export interface EventBridgeConstructProps extends cdk.StackProps {
  sechubSsmFunctin: node_lambda.NodejsFunction;
}

export class EventBridgeConstruct extends Construct {
  // public sechubSnsTopic: sns.Topic;
  // public sechubSqsQueue: sqs.Queue;
  // public lambdaEventSource: lambda_event_sources.SqsEventSource;
  constructor(scope: Construct, id: string, props: EventBridgeConstructProps) {
    super(scope, id);

    const sechubEeventBus = new events.EventBus(this, 'sechubEeventBus', {
      eventBusName: 'sechubEeventBus',
    });

    const sechubEeventRule = new events.Rule(this, 'sechubEeventRule', {
      eventBus: sechubEeventBus,
      eventPattern: {
        source: ['aws.securityhub'],
        detailType: ['Security Hub Findings - Imported'],
      },
    });

    const sechubSnsTopic = new sns.Topic(this, 'sechubSnsTopic', {
      topicName: 'sechubSnsTopic',
      displayName: 'sechubSnsTopic',
    });
    const sechubSqsQueue = new sqs.Queue(this, 'sechubSqsQueue', {
      queueName: 'sechubSqsQueue',
    });

    sechubEeventRule.addTarget(new targets.SnsTopic(sechubSnsTopic));
    sechubSnsTopic.addSubscription(
      new sns_subscription.SqsSubscription(sechubSqsQueue, {}),
    );
    const lambdaEventSource = new lambda_event_sources.SqsEventSource(
      sechubSqsQueue,
    );
    props.sechubSsmFunctin.addEventSource(lambdaEventSource);
  }
}
