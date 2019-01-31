// @flow
import type { $Request, $Response } from 'express';
import get from 'lodash/get';
import type { WebhookPayload } from './type';
import slack from './slack';
import * as prBot from './pr-bot';

async function handleGithubWebhook(req: $Request, res: $Response): Promise<void> {
  res.sendStatus(202);
  res.end();
  const event = req.header('X-Github-Event') || '';
  const payload = ((req.body: any): WebhookPayload);
  await prBot.handle(event, payload);
  await logToSlack(event, payload);
}

function logToSlack(event: string, payload: WebhookPayload): void {
  let msg = `Webhook, event: \`${event}\``;
  if (payload.action) {
    msg += `, action: \`${payload.action}\``;
  }
  if (get(payload, 'repository.name')) {
    msg += `, repo: \`${payload.repository.name}\``;
  }
  if (payload.number) {
    msg += `, pr: \`${payload.number}\``;
  }
  slack.postMessage(msg, '#_temp-gh-webhook');
}

module.exports = {
  handleGithubWebhook,
}
