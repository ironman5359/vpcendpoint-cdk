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
]


const app = new cdk.App();
for (const environment of environments) {
    const { account, region, vpc_list } = environment;
    for (const vpc of vpc_list) {
        new VPCEndpointStack(app, `Datadog-VPCEndpointStack-${account}-${region}-${vpc}`, {
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