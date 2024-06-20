interface PrivateLinkMap {
    [dnsName: string]: string;
}

export const datadogPrivateLinkMap: PrivateLinkMap = {
    // This is the private link mapping found on this page: https://docs.datadoghq.com/agent/guide/private-link/?tab=connectfromanotherregionusingvpcpeering
    'agent-http-intake.logs.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-025a56b9187ac1f63', //Logs (Agent HTTP intake)
    'http-intake.logs.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-0e36256cb6172439d', //Logs (User HTTP intake)
    'api.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-064ea718f8d0ead77', //API
    'metrics.agent.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-09a8006e245d1e7b8', //Metrics
    'orchestrator.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-0ad5fb9e71f85fe99', //Containers
    'process.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-0ed1f789ac6b0bde1', //Process
    'intake.profile.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-022ae36a7b2472029', //Profiling
    'trace.agent.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-0355bb1880dfa09c2', //Traces
    'dbm-metrics-intake.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-0ce70d55ec4af8501', //Database Monitoring
    'config.datadoghq.com':'com.amazonaws.vpce.us-east-1.vpce-svc-01f21309e507e3b1d', //Remote Configuration
};