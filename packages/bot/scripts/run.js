const path = require('path');
const { createProbot } = require('probot');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
require('@babel/register');
const appFn = require('../src/app').default;

const { env: {
  BOT_WEBHOOK_PROXY_URL,
  BOT_APP_ID,
  BOT_PORT,
  BOT_WEBHOOK_SECRET,
  BOT_PRIVATE_KEY,
} } = process;


const probot = createProbot({
  id: BOT_APP_ID,
  secret: BOT_WEBHOOK_SECRET,
  cert: BOT_PRIVATE_KEY,
  port: BOT_PORT || 3000,
  webhookProxy: BOT_WEBHOOK_PROXY_URL,
});

probot.setup([appFn]);
probot.start();
