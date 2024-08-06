#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VPCEndpointStack} from '../lib/vpcendpoint-cdk-stack';


interface Environment {
    account: string;
    region: string;
    vpc_list: string[];
}


const environments: Environment[] = [
        {
            account: '402324894655',
            region: 'us-east-1',
            vpc_list: [
               'vpc-0e57e18eaba57a337',
               'vpc-01b7d57feae42cb73',
               'vpc-0e3a3d00fd0f55a87',
               'vpc-0f446030e7a123115'
            ]
        },
        {
            account: '775794411819',
            region: 'us-east-1',
            vpc_list: [
                'vpc-014100fa54ec979ca', // Prod7 VPC
                'vpc-0fd10dd9e093a1389', // Prod5 VPC
                'vpc-03fad11e4929f9cd3', // VPC has no name
                'vpc-0f5fd0c268da049c9', // EKS Production VPC
                'vpc-0112e6bbe87a89aa9', // EKS CTL prod 3 VPC
                'vpc-0364e9f7706b0cce6', // EKS CTL prod 2 VPC
                'vpc-96d17df2',          // Default VPC
                'vpc-0a94363c2f3dd5bb5', // places DB stack VPC
                'vpc-0f2e65f9f1b25585d', // Prod shared resources
                'vpc-0aca71eb32d67e02a', // Sandbox McDonalds VPC
                'vpc-0fc0d9c990095f153', // Prod4 VPC
                'vpc-0eea34989ea2354ab'  // Prod6 VPC
            ]
        }
]


const app = new cdk.App();
for (const environment of environments) {
    const { account, region, vpc_list } = environment;
    for (const vpc of vpc_list) {
        new VPCEndpointStack(app, `Datadog-VPCEndpointStack-${account}-${region}-${vpc}`, {
            synthesizer: new cdk.DefaultStackSynthesizer(
                {generateBootstrapVersionRule: false}
            ),
            env: {
                account: account,
                region:  region
            },
            vpcId: vpc,
            service: 'DatadogEndpoints',

            // This is the private link mapping found on this page: https://docs.datadoghq.com/agent/guide/private-link/?tab=connectfromanotherregionusingvpcpeering
            endpointMap: {
                'agent-http-intake.logs.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-025a56b9187ac1f63', //Logs (Agent HTTP intake)
                'http-intake.logs.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-0e36256cb6172439d', //Logs (User HTTP intake)
                'api.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-064ea718f8d0ead77', //API
                'metrics.agent.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-09a8006e245d1e7b8', //Metrics
                'orchestrator.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-0ad5fb9e71f85fe99', //Containers
                'process.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-0ed1f789ac6b0bde1', //Process
                'intake.profile.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-022ae36a7b2472029', //Profiling
                'trace.agent.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-0355bb1880dfa09c2', //Traces
                'dbm-metrics-intake.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-0ce70d55ec4af8501', //Database Monitoring
                'config.datadoghq.com': 'com.amazonaws.vpce.us-east-1.vpce-svc-01f21309e507e3b1d', //Remote Configuration
            },
        });
    }
};