process.env.API_DB_HOST = 'test';
process.env.API_DB_USER = 'test';
process.env.API_DB_PASS = 'test';
process.env.API_DB_NAME = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '__tests__/.*spec\\.ts$',
};
