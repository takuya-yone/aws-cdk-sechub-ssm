import { Handler, Context, SQSEvent } from 'aws-lambda';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';

import { SSMClient } from '@aws-sdk/client-ssm';

type Severity = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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
  Workflow?: { Status: string };
  Severity?: { Label: Severity; Original: Severity };
};
// https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-required-attributes.html

function getFinding(event: SQSEvent): SecHubASFF {
  const _tmp = JSON.parse(event.Records[0].body).Message;
  const result = JSON.parse(_tmp).detail.findings[0];
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
    console.log(finding.Severity);
    console.log(finding);
    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  } else if (finding.ProductName === 'Security Hub') {
    console.log('Security Hub');
    console.log(finding.Severity);
    console.log(finding);
  } else if (finding.ProductName === 'Config') {
    console.log('Config');
    console.log(finding.Severity);
    console.log(finding);
    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  } else {
    console.log('Else');
    console.log(finding);
  }
  // logger.info(typeof finding);
  // logger.info(finding.Compliance);
  const ssmClient = new SSMClient({});
  // logger.info(ssmClient);
  return null;
};
