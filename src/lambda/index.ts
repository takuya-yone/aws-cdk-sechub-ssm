import { Handler, Context, SQSEvent } from 'aws-lambda';
import { SSMClient } from '@aws-sdk/client-ssm'; // ES Modules import

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

export const handler: Handler = async (event: SQSEvent, context: Context) => {
  // console.log(event);

  const finding = getFinding(event);
  console.log(finding);
  console.log(typeof finding);
  // console.log(finding.Compliance);
  const ssmClient = new SSMClient({});
  // console.log(ssmClient);
  return null;
};
