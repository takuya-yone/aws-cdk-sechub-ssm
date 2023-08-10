import { Handler, Context, SQSEvent } from 'aws-lambda';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';

import { SSMClient } from '@aws-sdk/client-ssm';

interface OpsItemProps {
  Description: string;
  RelatedOpsItems: [{ OpsItemId: string }];
  Source: string;
  Title: string;
  Tags: { Key: string; Value: string };
}
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm/command/CreateOpsItemCommand/

function getFinding(event: SQSEvent): object {
  const _tmp = JSON.parse(event.Records[0].body).Message;
  const _result = JSON.parse(_tmp).detail.findings[0] as object;
  return _result;
}

const tracer = new Tracer();
const logger = new Logger();

export const handler: Handler = async (event: SQSEvent, context: Context) => {
  tracer.getSegment();
  const finding = getFinding(event);
  logger.info(JSON.stringify(finding, null, 2));
  logger.info(typeof finding);
  // logger.info(finding.Compliance);
  const ssmClient = new SSMClient({});
  // logger.info(ssmClient);
  return null;
};
