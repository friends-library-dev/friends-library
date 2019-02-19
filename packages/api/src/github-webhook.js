// @flow
import type { $Request, $Response } from 'express';
import get from 'lodash/get';
import type { WebhookPayload } from './type';
import * as slack from './slack';

export async function handleGithubWebhook(
  req: $Request,
  res: $Response,
) {
  res.sendStatus(202);
  res.end();

  const event = req.header('X-Github-Event') || '';
  const payload = ((req.body: any): WebhookPayload);
  if (process.env.NODE_ENV === 'production') {
    await logToSlack(event, payload);
  }
}

async function logToSlack(event: string, payload: WebhookPayload) {
  let msg = `(api) Webhook, event: \`${event}\``;
  if (payload.action) {
    msg += `, action: \`${payload.action}\``;
  }
  if (get(payload, 'repository.name')) {
    msg += `, repo: \`${payload.repository.name}\``;
  }
  if (payload.number) {
    msg += `, pr: \`${payload.number}\``;
  }

  await slack.postMessage(msg, '#_temp-gh-webhook');
}
