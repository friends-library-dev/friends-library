require('dotenv').config();

const {
  env: {
    API_PRODUCTION_SERVER,
    API_DEPLOY_PATH,
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
      deployTo: API_DEPLOY_PATH,
      shared: {
        overwrite: true,
        files: ['packages/api/.env']
      }
    },
    production: {
      servers: API_PRODUCTION_SERVER
    }
  });

  shipit.on('published', () => {
    shipit.remote(`cd ${API_DEPLOY_PATH}/current/packages/api && yarn migrate`);
    shipit.remote('pm2 restart all');
  });
};
