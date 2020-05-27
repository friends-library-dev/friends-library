const https = require('https');

function postJson(path, json) {
  const body = JSON.stringify(json);
  https
    .request({
      hostname: 'api.github.com',
      path,
      method: 'POST',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.antiope-preview+json',
        'User-Agent': '@friends-library action',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    })
    .on('error', console.error)
    .end(body);
}

module.exports = {
  postJson,
};
