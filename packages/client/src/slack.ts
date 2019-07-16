import { requireEnv } from '@friends-library/types';
import { WebClient } from '@slack/client';

export async function send(msg: string, channel: string): Promise<void> {
  getClient().chat.postMessage({
    username: 'FL Bot',
    icon_emoji: ':robot_face:',
    parse: 'full',
    channel,
    text: msg,
  });
}

let client: WebClient | undefined;

function getClient(): WebClient {
  if (!client) {
    const { SLACK_API_TOKEN } = requireEnv('SLACK_API_TOKEN');
    client = new WebClient(SLACK_API_TOKEN);
  }
  return client;
}
