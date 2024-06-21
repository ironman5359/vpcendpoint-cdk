import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

interface PrivateLinkMap {
    [dnsName: string]: string;
}

export interface VPCEndpointProps extends cdk.StackProps {
  vpcId: string;
  endpointMap: PrivateLinkMap;
  service: string;
}

export class VPCEndpointStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: VPCEndpointProps ) {
    super(scope, id, props);

      // Look up an existing VPC
      const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
        vpcId: props.vpcId, // Replace with your VPC ID
      });

      const EndPointMaps = Object.entries(props.endpointMap)
      // Create VPCEndpoints for each entry in the mapping
      for (const [dnsName, vpceId] of EndPointMaps) {
          const endpoint = new ec2.InterfaceVpcEndpoint(this, `${dnsName.replace(/\./g, '-')}-VPCEndpoint`, {
              vpc,
              service: {
                  name: vpceId,
                  port: 443,
                  privateDnsDefault: true
              },
              privateDnsEnabled: true,
          });
          cdk.Tags.of(endpoint).add('Name', `${dnsName} VPCEndpoint`);

          // Define the metric for the PrivateLink endpoint data transfer
          const dataProcessedMetric = new cloudwatch.Metric({
              namespace: 'AWS/PrivateLinkEndpoints',
              metricName: 'BytesProcessed',
              dimensionsMap: {EndpointId: vpceId},
              statistic: 'Sum',
          });
      };
 }
}
