process.env.API_DB_HOST = 'test';
process.env.API_DB_USER = 'test';
process.env.API_DB_PASS = 'test';
process.env.API_DB_NAME = 'test';
process.env.API_URL = 'https://test-api.friendslibrary.com';
process.env.CLOUD_STORAGE_ENDPOINT = 'test';
process.env.CLOUD_STORAGE_KEY = 'test';
process.env.CLOUD_STORAGE_SECRET = 'test';
process.env.CLOUD_STORAGE_BUCKET_URL = 'test';
process.env.CLOUD_STORAGE_BUCKET = 'test';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '__tests__/.*spec\\.ts$',
};
