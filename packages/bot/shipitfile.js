require('@friends-library/env/load');
const env = require('@friends-library/env').default;

const { BOT_PRODUCTION_SERVER, BOT_DEPLOY_PATH, BOT_PORT } = env.require(
  'BOT_PRODUCTION_SERVER',
  'BOT_DEPLOY_PATH',
  'BOT_PORT',
);

module.exports = shipit => {
  require('shipit-deploy')(shipit);
  require('shipit-yarn')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@github.com:friends-library/friends-library.git',
      ignore: ['.git', 'node_modules'],
      keepReleases: 3,
      deleteOnRollback: false,
      shallowClone: true,
      deployTo: BOT_DEPLOY_PATH,
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
      },
    },
    production: {
      servers: BOT_PRODUCTION_SERVER,
    },
  });

  shipit.on('published', () => {
    shipit.remote('pm2 delete all');
    shipit.remote(`cd ${BOT_DEPLOY_PATH}/current && yarn compile bot`);
    shipit.remote(
      `cd ${BOT_DEPLOY_PATH}/current && NODE_PORT=${BOT_PORT} pm2 start packages/bot/dist/scripts/run.js`,
    );
  });
};
