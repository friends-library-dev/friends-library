require('dotenv').config();

const {
  env: {
    PRODUCTION_SERVER,
    DEPLOY_PATH,
    DEPLOY_KEY,
  },
} = process;

module.exports = function (shipit) {
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
      deployTo: DEPLOY_PATH,
      key: DEPLOY_KEY,
      shared: {
        overwrite: true,
        files: ['packages/api/.env']
      }
    },
    production: {
      servers: PRODUCTION_SERVER
    }
  });

  shipit.on('published', () => {
    shipit.remote(`cd ${DEPLOY_PATH}/current/packages/api && yarn migrate`);
    shipit.remote('pm2 restart all');
  });
};
