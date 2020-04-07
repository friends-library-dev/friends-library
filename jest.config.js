process.env.CLOUD_STORAGE_BUCKET_URL = '/cloud/bucket';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'packages/.*/__tests__/.*spec\\.ts$',
};
