/* eslint-disable @typescript-eslint/no-unused-vars */
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_lambda_nodejs as node_lambda } from 'aws-cdk-lib';
import { aws_events as events } from 'aws-cdk-lib';
import { aws_events_targets as targets } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_sns_subscriptions as sns_subscription } from 'aws-cdk-lib';
import { aws_lambda_event_sources as lambda_event_sources } from 'aws-cdk-lib';

export interface EventBridgeConstructProps extends cdk.StackProps {
  sechubSsmFunctin: node_lambda.NodejsFunction;
}

export class EventBridgeConstruct extends Construct {
  constructor(scope: Construct, id: string, props: EventBridgeConstructProps) {
    super(scope, id);

    // create event rule on default eventbus
    const sechubEeventRule = new events.Rule(this, 'sechubEeventRule', {
      eventPattern: {
        source: ['aws.securityhub'],
        detailType: ['Security Hub Findings - Imported'],
      },
    });

    // create sns topic
    const sechubSnsTopic = new sns.Topic(this, 'sechubSnsTopic', {
      topicName: 'sechubSnsTopic',
      displayName: 'sechubSnsTopic',
    });

    // create sqs topic
    const sechubSqsQueue = new sqs.Queue(this, 'sechubSqsQueue', {
      queueName: 'sechubSqsQueue',
    });

    // set sns topic as eventbridge rule target
    sechubEeventRule.addTarget(new targets.SnsTopic(sechubSnsTopic));

    // set sqs queue as sns subscription
    sechubSnsTopic.addSubscription(
      new sns_subscription.SqsSubscription(sechubSqsQueue, {}),
    );

    // mapping sqs eventsource whith lambda
    const lambdaEventSource = new lambda_event_sources.SqsEventSource(
      sechubSqsQueue,
      {
        batchSize: 1,
      },
    );

    // set lambda as sqs queue target
    props.sechubSsmFunctin.addEventSource(lambdaEventSource);
  }
}
