import { WebClient } from '@slack/client';

const client = new WebClient(process.env.SLACK_API_TOKEN);

export async function postMessage(text: string, channel: string, opts: Object = {}) {
  // See: https://api.slack.com/methods/chat.postMessage
  const options = Object.assign(
    {
      username: 'Api Bot',
      icon_emoji: ':robot_face:',
      parse: 'full',
    },
    opts,
    {
      channel,
      text,
    },
  );
  await client.chat.postMessage(options);
}

export async function uploadSnippet(filename: string, content: string, channel: string) {
  // See: https://api.slack.com/methods/files.upload
  const res = await client.files.upload({
    filename,
    content,
    channel,
  });

  // @ts-ignore
  return res.file;
}
