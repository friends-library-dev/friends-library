/* eslint-disable global-require */
require('dotenv').config({ path: '../../.env' });

const {
  env: {
    API_PRODUCTION_SERVER,
    API_DEPLOY_PATH,
    BOT_PORT,
  },
} = process;

module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-yarn')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/api',
      repositoryUrl: 'git@github.com:friends-library/friends-library.git',
      ignore: ['.git', 'node_modules'],
      keepReleases: 5,
      deleteOnRollback: false,
      shallowClone: true,
      deployTo: API_DEPLOY_PATH,
      shared: {
        overwrite: true,
        files: [
          '.env',
          'packages/friends/yml/en/jane-doe.yml', // sandbox friend
          'packages/friends/yml/en/john-doe.yml', // sandbox friend
        ],
      },
      yarn: {
        remote: true,
        installArgs: ['; npm rebuild node-sass'],
      },
    },
    production: {
      servers: API_PRODUCTION_SERVER,
    },
  });

  shipit.on('published', () => {
    shipit.remote(`cd ${API_DEPLOY_PATH}/current/packages/api && yarn migrate`);
    shipit.remote('pm2 delete all');
    shipit.remote(`cd ${API_DEPLOY_PATH}/current && NODE_ENV=production pm2 start packages/api/index.js`);
    shipit.remote(`cd ${API_DEPLOY_PATH}/current && NODE_PORT=${BOT_PORT} pm2 start packages/bot/dist/scripts/run.js`);
  });
};
