const NetlifyAPI = require('netlify');
const core = require('@actions/core');

const client = new NetlifyAPI(process.env.NETLIFY_API_TOKEN);

async function main() {
  const { SHORT_SHA, PR_NUMBER, PR_TITLE, DEPLOY_SITE_ID, GITHUB_REF } = process.env;
  const isOpenPr = GITHUB_REF !== 'refs/heads/master';

  let message = `Push commit @${SHORT_SHA}`;
  if (PR_NUMBER && isOpenPr) {
    message = `PR #${PR_NUMBER}@${SHORT_SHA} "${PR_TITLE}"`;
  } else if (PR_NUMBER && !isOpenPr) {
    message = `Merge PR#${PR_NUMBER}@${SHORT_SHA} to master`;
  }

  try {
    const res = await client.deploy(DEPLOY_SITE_ID, `./public`, {
      message,
      fnDir: `../functions/dist`,
      draft: isOpenPr,
      statusCb: status => status.type !== 'hashing' && console.log(status.msg),
    });
    const url = res.deploy.deploy_ssl_url;
    core.setOutput('url', url);
    console.log(`Deploy url: ${url}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
