import type { AWS } from '@serverless/typescript';

import BuildEconomicsData from '@functions/BuildEconomicsData';

const serverlessConfiguration: AWS = {
  service: 'spectator-functions',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  package: {
    individually: true
  },
  plugins: ['serverless-dotenv-plugin', 'serverless-offline', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      NODE_ENV: '${env:NODE_ENV}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: 'arn:aws:s3:::${env:ECONOMICS_BUCKET_NAME}/${env:ECONOMICS_OBJECT_KEY}'
      },
      {
        Effect: 'Allow',
        Action: ['cloudfront:CreateInvalidation'],
        Resource: 'arn:aws:cloudfront::${env:AWS_ACCOUNT_ID}:distribution/${env:DISTRIBUTION_ID}'
      }
    ],
    lambdaHashingVersion: '20201221'
  },
  functions: { BuildEconomicsData }
};

module.exports = serverlessConfiguration;
