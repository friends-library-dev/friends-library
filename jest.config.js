process.env.API_URL = 'https://test-api.friendslibrary.com';

module.exports = {
  errorOnDeprecated: true,
  testEnvironment: 'node',
  testRegex: '__tests__/.*tests?\\.js$',
  modulePathIgnorePatterns: [
    '<rootDir>/packages/jones/build',
    '<rootDir>/packages/evans/public',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/cli',
    '<rootDir>/packages/mod',
  ],
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 85,
      functions: 94,
      lines: 94,
    },
  },
};
