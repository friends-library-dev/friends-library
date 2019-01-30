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
  const channel = '#_temp-gh-webhook';
  const filename = `webhook-${Date.now()}.json`;
  const msg = `New incoming github webhook, event: \`${event}\``;
  const json = JSON.stringify(payload, null, 2);
  const file = slack.uploadSnippet(filename, json, channel);
  slack.postMessage('', channel, {
    attachments: [{
      fallback: 'webhook payload',
      pretext: msg,
      title: "Payload JSON",
      title_link: file.permalink,
      color: "#7CD197"
    }]
  });
}

module.exports = {
  handleGithubWebhook,
}
