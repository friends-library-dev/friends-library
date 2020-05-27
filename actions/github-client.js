// @ts-check
const https = require('https');

/**
 * @param {string} path
 * @param {Record<string, any>} json
 * @returns {Promise<string>}
 */
function postJson(path, json) {
  const body = JSON.stringify(json);
  return new Promise((resolve, reject) => {
    https
      .request(
        {
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
        },
        response => {
          let data = '';
          response.on('data', chunk => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(data);
          });
        },
      )
      .on('error', reject)
      .end(body);
  });
}

module.exports = {
  postJson,
};
