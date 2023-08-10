import { Handler, Context, SQSEvent } from 'aws-lambda';

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
  return context.logStreamName;
};
