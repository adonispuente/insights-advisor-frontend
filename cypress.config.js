const { defineConfig } = require('cypress');
const { devServer } = require('@cypress/webpack-dev-server');
const webpackConfig = require('./config/cypress.webpack.config.js');

module.exports = defineConfig({
  viewportWidth: 1000,
  viewportHeight: 660,
  video: false,
  component: {
    devServer(devServerConfig) {
      return devServer({
        ...devServerConfig,
        framework: 'react',
        webpackConfig,
      });
      // TODO: add coverage plugin
    },
  },
});
