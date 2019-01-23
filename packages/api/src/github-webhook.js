const slack = require('./slack');

async function handleGithubWebhook(req, res) {
  res.sendStatus(202);
  res.end();

  // for now, just log it to slack so I can figure out
  // which events I want to handle, and what their payload is
  const channel = '#_temp-gh-webhook';
  const payload = JSON.stringify(req.body, null, 2);
  const filename = `webhook-${Date.now()}.json`;
  const event = req.header('X-Github-Event');
  const msg = `New incoming github webhook, event: \`${event}\``;
  const file = await slack.uploadSnippet(filename, payload, channel);
  await slack.postMessage('', channel, {
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
