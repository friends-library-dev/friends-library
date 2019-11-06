import '@friends-library/env/load';
import env from '@friends-library/env';
import { createProbot } from 'probot';
import appFn from '../app';

const { BOT_APP_ID, BOT_WEBHOOK_SECRET, BOT_PRIVATE_KEY } = env.require(
  'BOT_APP_ID',
  'BOT_WEBHOOK_SECRET',
  'BOT_PRIVATE_KEY',
);

const probot = createProbot({
  id: +BOT_APP_ID,
  secret: BOT_WEBHOOK_SECRET,
  cert: BOT_PRIVATE_KEY,
  port: Number(process.env.BOT_PORT || 3000),
  webhookProxy: process.env.BOT_WEBHOOK_PROXY_URL,
});

probot.setup([appFn]);
probot.start();
