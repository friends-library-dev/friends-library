const NetlifyAPI = require('netlify');
const core = require('@actions/core');

const client = new NetlifyAPI(process.env.NETLIFY_API_TOKEN);

async function main() {
  const { SHORT_SHA, PR_NUMBER, PR_TITLE, DEPLOY_SITE_ID, GITHUB_REF } = process.env;
  let message = `Commit ${SHORT_SHA}`;
  if (PR_NUMBER) {
    message = `PR #${PR_NUMBER}@${SHORT_SHA} "${PR_TITLE}"`;
  }

  try {
    const res = await client.deploy(DEPLOY_SITE_ID, `./public`, {
      fnDir: `../functions/dist`,
      draft: GITHUB_REF !== 'refs/heads/master',
      message,
      statusCb: status => status.type !== 'hashing' && console.log(status.msg),
    });
    core.setOutput('deployUrl', res.deploy.deploy_ssl_url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
