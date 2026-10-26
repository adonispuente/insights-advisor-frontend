const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const base = require('./fec.base');
const rootDir = resolve(__dirname, '..');

const iopAliases = {
  '@redhat-cloud-services/frontend-components/InsightsLink': resolve(
    rootDir,
    './src/iop/AdvisorLink.js',
  ),
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate':
    resolve(rootDir, './src/iop/useAdvisorNavigate.js'),
  '@redhat-cloud-services/frontend-components-utilities/interceptors$': resolve(
    rootDir,
    './src/iop/interceptors.js',
  ),
  react: resolve(rootDir, 'node_modules/react'),
  'react-dom': resolve(rootDir, 'node_modules/react-dom'),
  'react/jsx-runtime': resolve(rootDir, 'node_modules/react/jsx-runtime'),
};

module.exports = {
  ...base,
  appUrl: '/',
  SPAFallback: false,
  definePlugin: {
    'process.env.IOP': JSON.stringify('true'),
    'process.env.IOP_API_MOCKED': JSON.stringify(
      process.env.IOP_API_MOCKED === 'true' ? 'true' : 'false',
    ),
  },
  deployment: 'assets/apps',
  standalone: true,
  appEntry: resolve(rootDir, './src/iop/entry.js'),
  plugins: [
    {
      apply(compiler) {
        // PF5 and PF6 ship different fonts with the same filenames. FEC's
        // default fonts/[name][ext] output would make them overwrite each other.
        for (const rule of compiler.options.module.rules) {
          if (rule.type === 'asset/resource') {
            rule.generator = {
              ...rule.generator,
              filename: 'fonts/[name].[contenthash:8][ext]',
            };
          }
        }
      },
    },
    ...(process.env.ENABLE_SENTRY
      ? [
          sentryWebpackPlugin({
            ...(process.env.SENTRY_AUTH_TOKEN && {
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
            org: 'red-hat-it',
            project: 'advisor-rhel',
            moduleMetadata: ({ release }) => ({
              dsn: `https://cb035c73625db2cf00141494a95bdedb@o490301.ingest.us.sentry.io/4508683271077888`,
              org: 'red-hat-it',
              project: 'advisor-rhel',
              release,
            }),
          }),
        ]
      : []),
    new HtmlWebpackPlugin({
      template: resolve(rootDir, './src/iop/index.html'),
      inject: true,
      chunks: ['App'],
    }),
  ],
  moduleFederation: {
    bundleChromeShared: true,
    exposes: {
      './RootApp': resolve(rootDir, './src/iop/IopAppEntry'),
    },
  },
  resolve: {
    ...base.resolve,
    alias: {
      ...base.resolve.alias,
      ...iopAliases,
    },
  },
};
