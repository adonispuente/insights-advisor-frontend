const { resolve } = require('path');

process.env.FEC_CONFIG_PATH = resolve(__dirname, '../fec.config.js');
const createConfig = require('@redhat-cloud-services/frontend-components-config/bin/prod.webpack.config');

module.exports = (env) => {
  const config = createConfig(env);
  return {
    ...config,
    output: {
      ...config.output,
      path: resolve(__dirname, '../dist/assets/apps/advisor'),
    },
  };
};
