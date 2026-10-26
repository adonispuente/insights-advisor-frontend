export const staticUnleashFlagProviderConfig = {
  url: 'http://localhost:8002/client',
  clientKey: 'advisor',
  appName: 'advisor',
  refreshInterval: 0,
  metricsInterval: 0,
  disableRefresh: true,
  disableMetrics: true,
  bootstrap: [
    { name: 'advisor.lightspeed_enabled', enabled: true },
    { name: 'advisor.is_dashboard_displayed', enabled: true },
  ],
};
