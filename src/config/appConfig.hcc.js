const config = Object.freeze({
  envTarget: 'hcc',
  features: Object.freeze({ unleash: true, pdf: true, lightspeed: true }),
  api: Object.freeze({
    advisorBasePath: '/api/insights/v1',
    inventoryBasePath: '/api/inventory/v1',
  }),
});
export const getAppConfigHcc = () => config;
