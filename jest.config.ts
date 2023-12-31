import type { Config } from 'jest';

const ignore = ['/node_modules/', '/dist/', '/generated/'];

const config: Config = {
  preset: 'ts-jest',
  // coverageDirectory: 'test-report/coverage',
  // collectCoverage: true,
  reporters: ['default', ['github-actions', { silent: false }]],
  // collectCoverageFrom: [`<rootDir>/packages/**/src/**/*.ts`],
  // coveragePathIgnorePatterns: ignore,
  // coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }]],
  rootDir: './',
  testPathIgnorePatterns: ignore
};

module.exports = config;
