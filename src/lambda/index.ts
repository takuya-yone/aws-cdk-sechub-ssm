import { Handler, Context, SQSEvent } from 'aws-lambda';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Logger } from '@aws-lambda-powertools/logger';

import {
  SSMIncidentsClient,
  StartIncidentCommand,
  StartIncidentInput,
  UpdateIncidentRecordCommand,
  UpdateIncidentRecordInput,
} from '@aws-sdk/client-ssm-incidents';

type Severity = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

type SecHubASFF = {
  AwsAccountId: string;
  CreatedAt: string;
  Description: string;
  GeneratorId: string;
  Id: string;
  ProductArn: string;
  Resouces: [object];
  SchemaVersion: string;
  Title: string;
  ProductName?: string;
  Region?: string;
  Remendiation?: { Recommendation: { Text: string; Url: string } };
  SourceUrl?: string;
  Workflow?: { Status: string };
  Severity: { Label: Severity; Original: Severity };
};
// https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-required-attributes.html

type impactLevel = 1 | 2 | 3 | 4 | 5;

// type StartIncidentInput = {
//   responsePlanArn: string | undefined;
//   title: string;

//   impact: impactLevel;
// };
//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm-incidents/command/StartIncidentCommand/

// type StartIncidentInput = {
//   responsePlanArn: string | undefined;
//   title: string;

//   impact: impactLevel;
// };

const getImpactFromSeverity = (label: string): impactLevel => {
  if (label === 'CRITICAL') {
    return 1;
  } else if (label === 'HIGH') {
    return 2;
  } else if (label === 'MEDIUM') {
    return 3;
  } else if (label === 'LOW') {
    return 4;
  } else {
    return 5;
  }
};

const createIncident = async (finding: SecHubASFF): Promise<void> => {
  const client = new SSMIncidentsClient({});

  const startIncidentInput: StartIncidentInput = {
    responsePlanArn: process.env['RESPONSE_PLAN_ARN'],
    title: finding.Title,
    impact: getImpactFromSeverity(finding.Severity.Label),
  };
  const startIncidentCommand = new StartIncidentCommand(startIncidentInput);
  const incidentRecordArn = (await client.send(startIncidentCommand))
    .incidentRecordArn;

  const updateIncidentRecordInput: UpdateIncidentRecordInput = {
    arn: incidentRecordArn,
    summary: `# SourceUrl\n${finding.SourceUrl}\n# Description\n${finding.Description}`,
  };
  const updateIncidentRecordCommand = new UpdateIncidentRecordCommand(
    updateIncidentRecordInput,
  );
  const response = await client.send(updateIncidentRecordCommand);
  console.log(response);
};

const getFinding = (event: SQSEvent): SecHubASFF => {
  const _tmp = JSON.parse(event.Records[0].body).Message;
  const result = JSON.parse(_tmp).detail.findings[0];
  return result as SecHubASFF;
};

const tracer = new Tracer();
const logger = new Logger();

export const handler: Handler = async (event: SQSEvent, context: Context) => {
  tracer.getSegment();
  const finding: SecHubASFF = getFinding(event);
  console.log(JSON.stringify(finding, null, 2));

  if (
    finding.ProductName === 'GuardDuty' &&
    finding.Workflow?.Status === 'NEW'
  ) {
    console.log('GuardDuty');
    // console.log(finding.Severity);
    // console.log(finding);

    await createIncident(finding);

    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  } else if (
    finding.ProductName === 'Security Hub' &&
    finding.Workflow?.Status === 'NEW'
  ) {
    console.log('Security Hub');
    // console.log(finding.Severity);
    // console.log(finding);
  } else if (
    finding.ProductName === 'Config' &&
    finding.Workflow?.Status === 'NEW'
  ) {
    console.log('Config');
    // console.log(finding.Severity);
    // console.log(finding);
    // console.log(finding.SourceUrl);
    // console.log(finding.AwsAccountId);
  } else {
    console.log('Else');
    // console.log(finding);
  }
  // logger.info(typeof finding);
  // logger.info(finding.Compliance);
  // const ssmClient = new SSMClient({});

  // logger.info(ssmClient);
  return null;
};
