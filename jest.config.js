process.env.LULU_API_ENDPOINT = '/lulu-api';
process.env.LULU_CLIENT_KEY = 'lulu-client-key';
process.env.LULU_CLIENT_SECRET = 'lulu-client-secret';
process.env.LULU_API_ENDPOINT = '/lulu-api';
process.env.CLOUD_STORAGE_ENDPOINT = '/cloud/endpoint';
process.env.CLOUD_STORAGE_KEY = 'cloud-key';
process.env.CLOUD_STORAGE_SECRET = 'cloud-secret';
process.env.CLOUD_STORAGE_BUCKET_URL = '/cloud/bucket';
process.env.CLOUD_STORAGE_BUCKET = 'bucket';
process.env.STRIPE_SECRET_KEY = 'stripe-secret-key';
process.env.SENDGRID_API_KEY = 'sendgrid-api-key';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'packages/.*/__tests__/.*spec\\.ts$',
};
