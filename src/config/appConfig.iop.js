const config = Object.freeze({
  envTarget: 'iop',
  features: Object.freeze({ unleash: false, pdf: false, lightspeed: true }),
  api: Object.freeze({
    advisorBasePath: '/insights_cloud/api/insights/v1',
    inventoryBasePath: '/insights_cloud/api/inventory/v1',
  }),
});
export const getAppConfigIop = () => config;
