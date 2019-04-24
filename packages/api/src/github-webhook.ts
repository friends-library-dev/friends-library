import { Request, Response } from 'express';
import get from 'lodash/get';
import * as slack from './slack';

interface WebhookPayload {
  [key: string]: any;
}

export async function handleGithubWebhook(req: Request, res: Response): Promise<void> {
  res.sendStatus(202);
  res.end();

  const event = req.header('X-Github-Event') || '';
  const payload = <WebhookPayload>req.body;
  if (process.env.NODE_ENV === 'production') {
    await logToSlack(event, payload);
  }
}

async function logToSlack(event: string, payload: WebhookPayload): Promise<void> {
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
