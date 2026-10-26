const { resolve } = require('path');
const packageJson = require('../package.json');

const bundle = 'insights';
const appName = packageJson[bundle].appname;

module.exports = {
  appName,
  useProxy: process.env.PROXY === 'true',
  devtool: 'hidden-source-map',
  frontendCRDPath: resolve(__dirname, '../deploy/frontend.yaml'),
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '~': resolve(__dirname, '../src'),
    },
  },
};
