import { Handler, Context, SQSEvent } from 'aws-lambda';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';

import { SSMClient } from '@aws-sdk/client-ssm';

type OpsItemProps = {
  Description: string;
  RelatedOpsItems: [{ OpsItemId: string }];
  Source: string;
  Title: string;
  Tags: { Key: string; Value: string };
};
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm/command/CreateOpsItemCommand/

type SecHubASFF = {
  AwsAccountId: string;
  CreatedAt: string;
  Description: string;
  GeneratorId: string;
  Id: string;
  ProductArn: string;
  Resouces: [object];
  SchemaVersion: string;
  ProductName?: string;
  Region?: string;
  Remendiation?: { Recommendation: { Text: string; Url: string } };
  SourceUrl?: string;
};
// https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-required-attributes.html

function getFinding(event: SQSEvent): SecHubASFF {
  const _tmp = JSON.parse(event.Records[0].body).Message;
  const result = JSON.parse(_tmp).detail.findings[0] as object;
  return result as SecHubASFF;
}

const tracer = new Tracer();
const logger = new Logger();

export const handler: Handler = async (event: SQSEvent, context: Context) => {
  tracer.getSegment();
  const finding: SecHubASFF = getFinding(event);
  // console.log(JSON.stringify(finding, null, 2));

  if (finding.ProductName === 'GuardDuty') {
    console.log('guardduty');
    console.log(finding);
    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  }
  if (finding.ProductName === 'Config') {
    console.log('Config');
    console.log(finding);
    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  }

  // logger.info(typeof finding);
  // logger.info(finding.Compliance);
  const ssmClient = new SSMClient({});
  // logger.info(ssmClient);
  return null;
};
