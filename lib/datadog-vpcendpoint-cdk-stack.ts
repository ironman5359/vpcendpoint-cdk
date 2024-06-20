import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';
import * as utils from './datadog-dns-vpc-map';
import {ISecurityGroup} from "aws-cdk-lib/aws-ec2";
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'

export interface DatadogVPCEndpointProps extends cdk.StackProps {
  vpcId: string;
  subnetIds: string[];
  securityGroupIds: ISecurityGroup[];
  
}

export class DatadogVPCEndpointStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DatadogVPCEndpointProps ) {
    super(scope, id, props);

      // Look up an existing VPC
      const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
        vpcId: props.vpcId, // Replace with your VPC ID
      });

      // Create the Endpoint
      const endpoint = new ec2.InterfaceVpcEndpoint(this, `${dnsName.replace(/\./g, '-')}-VPCEndpoint`, {
          vpc,
          service: {
              name: vpc.vpcId,
              port: 443,
              privateDnsDefault: true
          },
          privateDnsEnabled: true,
          securityGroups: props.securityGroupIds, // Replace with your security group IDs
          subnets: {
              subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          },
      });
      cdk.Tags.of(endpoint).add('Name', `Datadog VPCEndpoint`);

      // The hosted zone for your domain
      const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'MyHostedZone', {
          hostedZoneId: 'Z1234567890EXAMPLE', // Replace with your actual hosted zone ID
          zoneName: 'example.com', // Replace with your domain name
      });

      // Create VPCEndpoints for each entry in the mapping
      Object.entries(utils.datadogPrivateLinkMap).forEach(([dnsName, vpceId]) => {
          cdk.Tags.of(endpoint).add('Name', `${dnsName} VPCEndpoint`);

          // Create a DNS record that points to the VPC endpoint
          new route53.ARecord(this, 'AliasRecord', {
              zone: hostedZone,
              target: route53.RecordTarget.fromAlias(new route53Targets.InterfaceVpcEndpointTarget(endpoint)),
              recordName: 'myservice', // The subdomain you want to use
          });

      });

      // The VPC endpoint service name
      const serviceName = 'vpce-svc-xxxxxxxxxxxxxx'; // Replace with your VPC endpoint service name

      // Define the metric for the PrivateLink endpoint data transfer
      const dataProcessedMetric = new cloudwatch.Metric({
          namespace: 'AWS/VPC',
          metricName: 'DataProcessedBytes',
          dimensionsMap: {EndpointId: ''},
          statistic: 'Sum',
      });

      // Create a CloudWatch Dashboard
      const dashboard = new cloudwatch.Dashboard(this, 'PrivateLinkDashboard', {
          dashboardName: 'PrivateLinkMonitoringDashboard',
      });

      // Add a Graph Widget to the Dashboard
      dashboard.addWidgets(
          new cloudwatch.GraphWidget({
              title: 'Data Processed by PrivateLink Endpoint',
              left: [dataProcessedMetric],
          }),
      );
 }
}
