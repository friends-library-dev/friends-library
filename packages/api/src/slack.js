const { WebClient } = require('@slack/client');

const token = process.env.SLACK_API_TOKEN;
const client = new WebClient(token);

async function postMessage(text, channel, opts = {}) {
  try {
    // See: https://api.slack.com/methods/chat.postMessage
    const options = Object.assign({
      username: 'Api Bot',
      icon_emoji: ':robot_face:',
      parse: 'full',
    }, opts, {
      channel,
      text,
    });
    return await client.chat.postMessage(options);
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
}

async function uploadSnippet(filename, content, channel, opts = {}) {
  try {
    // See: https://api.slack.com/methods/files.upload
    const res = await client.files.upload({
      filename,
      content,
      channel,
    });
    return res.file;
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
}

module.exports = {
  postMessage,
  uploadSnippet,
}
