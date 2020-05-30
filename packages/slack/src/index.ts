import env from '@friends-library/env';
import { WebClient } from '@slack/client';

export async function send(
  msg: string,
  channel: string,
  emoji = ':robot_face:',
): Promise<void> {
  getClient().chat.postMessage({
    username: 'FL Bot',
    icon_emoji: emoji,
    parse: 'full',
    channel,
    text: msg,
    blocks: [sectionBlock(msg)],
  });
}

export async function sendJson(
  msg: string,
  data: Record<string, Record<string, any>>,
  channel: string,
  emoji = ':robot_face:',
): Promise<void> {
  const blocks = [sectionBlock(msg)];
  for (const label in data) {
    blocks.push(sectionBlock(`_${label.toUpperCase()}:_`));
    blocks.push(sectionBlock('```' + JSON.stringify(data[label], null, 2) + '```'));
  }
  getClient().chat.postMessage({
    username: 'FL Bot',
    icon_emoji: emoji,
    parse: 'full',
    channel,
    text: msg,
    blocks,
  });
}

let client: WebClient | undefined;

function getClient(): WebClient {
  if (!client) {
    const { SLACK_API_TOKEN } = env.require('SLACK_API_TOKEN');
    client = new WebClient(SLACK_API_TOKEN);
  }
  return client;
}

interface SectionBlock {
  type: 'section';
  text: {
    type: 'mrkdwn';
    text: string;
  };
}

function sectionBlock(text: string): SectionBlock {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  };
}
